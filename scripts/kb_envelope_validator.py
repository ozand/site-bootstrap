"""Minimal validator for raw-v1 and canonical-v1 knowledge envelopes.

The validator checks metadata shape and evidence-reference integrity only. It does
not migrate legacy records, inspect payload contents, or update QMD indexes.
"""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path
from typing import Any, Iterable, List, Mapping, Optional, Set, Tuple

import yaml


_RAW_REQUIRED = {
    "raw_schema",
    "capture_id",
    "status",
    "source_type",
    "source_url",
    "source_title",
    "author",
    "organization",
    "published_at",
    "updated_at",
    "captured_at",
    "source_version",
    "retrieval",
    "content",
    "provenance",
    "quality",
    "rights",
    "tags",
}
_CANONICAL_REQUIRED = {
    "canonical_schema",
    "id",
    "title",
    "category",
    "tags",
    "status",
    "created",
    "updated",
    "environment",
    "version_scope",
    "claims",
    "evidence_refs",
    "verification",
    "alternatives",
    "unresolved_conflicts",
    "supersedes",
    "superseded_by",
    "provenance",
    "error_signatures",
}
_SOURCE_TYPES = {"web", "reddit", "youtube", "github"}
_LOCATOR_KINDS = {
    "heading",
    "line_range",
    "timestamp",
    "reddit_post",
    "reddit_comment",
    "github_path",
    "json_path",
}
_SHA256 = re.compile(r"^(?:sha256:)?[0-9a-f]{64}$")
_CHANNEL_REQUIRED = {
    "web": ("canonical_url", "publisher", "locator", "response_validators"),
    "reddit": ("subreddit", "post_id", "comment_id", "parent_id", "link_id", "permalink", "edited_at_capture", "score_at_capture", "locator"),
    "youtube": ("video_id", "channel_id", "channel_title", "duration_seconds", "transcript_language", "transcript_kind", "captions_track", "locator"),
    "github": ("repository", "object_type", "ref", "commit_sha", "path", "blob_sha", "issue_or_pr", "comment_id", "locator"),
}


def _is_mapping(value: Any) -> bool:
    return isinstance(value, Mapping)


def _is_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _required(mapping: Mapping[str, Any], fields: Iterable[str], prefix: str, errors: List[str]) -> None:
    for field in sorted(fields):
        if field not in mapping:
            errors.append(f"{prefix}.{field} is required")


def _check_evidence_refs(record: Mapping[str, Any], errors: List[str]) -> set[str]:
    refs = record.get("evidence_refs")
    if not isinstance(refs, list):
        errors.append("evidence_refs must be a list")
        return set()

    ids: Set[str] = set()
    for index, ref in enumerate(refs):
        prefix = f"evidence_refs[{index}]"
        if not _is_mapping(ref):
            errors.append(f"{prefix} must be an object")
            continue
        for field in ("evidence_id", "source_type", "url", "captured_at", "source_version", "locator", "notes"):
            if field not in ref:
                errors.append(f"{prefix}.{field} is required")
        evidence_id = ref.get("evidence_id")
        if not _is_nonempty_string(evidence_id):
            errors.append(f"{prefix}.evidence_id must be a non-empty string")
        elif evidence_id in ids:
            errors.append(f"{prefix}.evidence_id is duplicated")
        else:
            ids.add(evidence_id)
        if ref.get("source_type") not in _SOURCE_TYPES:
            errors.append(f"{prefix}.source_type is invalid")
        if not _is_nonempty_string(ref.get("url")):
            errors.append(f"{prefix}.url must be a non-empty string")
        if not _is_nonempty_string(ref.get("captured_at")):
            errors.append(f"{prefix}.captured_at must be a non-empty string")
        if not _is_nonempty_string(ref.get("source_version")):
            errors.append(f"{prefix}.source_version must be a non-empty string")
        locator = ref.get("locator")
        if not _is_mapping(locator):
            errors.append(f"{prefix}.locator must be an object")
        else:
            if locator.get("kind") not in _LOCATOR_KINDS:
                errors.append(f"{prefix}.locator.kind is invalid")
            if not _is_nonempty_string(locator.get("value")):
                errors.append(f"{prefix}.locator.value must be a non-empty string")
        if not _is_nonempty_string(ref.get("notes")):
            errors.append(f"{prefix}.notes must be a non-empty string")
    return ids


def _validate_raw(record: Mapping[str, Any], errors: List[str]) -> None:
    _required(record, _RAW_REQUIRED, "record", errors)
    if record.get("raw_schema") != "raw-v1":
        errors.append("record.raw_schema must be raw-v1")
    if "canonical_schema" in record:
        errors.append("record cannot declare both raw_schema and canonical_schema")
    if "canonical_url" in record:
        errors.append("record.canonical_url is ambiguous; use the channel block")
    for field in ("capture_id", "status", "source_type", "source_url", "captured_at", "source_version"):
        if field in record and not _is_nonempty_string(record[field]):
            errors.append(f"record.{field} must be a non-empty string")
    source_type = record.get("source_type")
    channels = [name for name in _SOURCE_TYPES if name in record]
    if len(channels) != 1:
        errors.append("record must contain exactly one channel block")
    elif channels[0] != source_type:
        errors.append("record.source_type must match its channel block")
    for name in channels:
        channel = record[name]
        if not _is_mapping(channel):
            errors.append(f"record.{name} must be an object")
            continue
        for field in _CHANNEL_REQUIRED[name]:
            if field not in channel:
                errors.append(f"record.{name}.{field} is required")
    retrieval = record.get("retrieval")
    if not _is_mapping(retrieval):
        errors.append("record.retrieval must be an object")
    else:
        for field in ("method", "tool", "tool_version", "http_status", "media_type", "language"):
            if field not in retrieval:
                errors.append(f"record.retrieval.{field} is required")
    content = record.get("content")
    if not _is_mapping(content):
        errors.append("record.content must be an object")
    else:
        for field in ("representation", "sha256", "byte_count", "excerpted", "transform"):
            if field not in content:
                errors.append(f"record.content.{field} is required")
        if "sha256" in content and not _SHA256.fullmatch(str(content["sha256"])):
            errors.append("record.content.sha256 must be a 64-hex digest, optionally prefixed with sha256:")
        if "byte_count" in content and (not isinstance(content["byte_count"], int) or content["byte_count"] < 0):
            errors.append("record.content.byte_count must be a non-negative integer")
        if "excerpted" in content and not isinstance(content["excerpted"], bool):
            errors.append("record.content.excerpted must be boolean")
    for section in ("provenance", "quality", "rights"):
        if not _is_mapping(record.get(section)):
            errors.append(f"record.{section} must be an object")
    if _is_mapping(record.get("provenance")) and not _is_nonempty_string(record["provenance"].get("captured_by")):
        errors.append("record.provenance.captured_by must be a non-empty string")
    if _is_mapping(record.get("quality")):
        if record["quality"].get("source_quality") not in {"high", "medium", "low", "unknown"}:
            errors.append("record.quality.source_quality is invalid")
        if record["quality"].get("claim_status") not in {"confirmed", "corroborated", "reported", "hypothesis", "unknown"}:
            errors.append("record.quality.claim_status is invalid")
        if not isinstance(record["quality"].get("limitations"), list):
            errors.append("record.quality.limitations must be a list")


def _validate_canonical(record: Mapping[str, Any], errors: List[str]) -> None:
    _required(record, _CANONICAL_REQUIRED, "record", errors)
    if record.get("canonical_schema") != "canonical-v1":
        errors.append("record.canonical_schema must be canonical-v1")
    if "raw_schema" in record:
        errors.append("record cannot declare both canonical_schema and raw_schema")
    if not _is_nonempty_string(record.get("id")):
        errors.append("record.id must be a non-empty string")
    evidence_ids = _check_evidence_refs(record, errors)
    claims = record.get("claims")
    if not isinstance(claims, list):
        errors.append("claims must be a list")
    else:
        claim_ids: Set[str] = set()
        for index, claim in enumerate(claims):
            prefix = f"claims[{index}]"
            if not _is_mapping(claim):
                errors.append(f"{prefix} must be an object")
                continue
            for field in ("claim_id", "text", "type", "status", "evidence_refs", "scope"):
                if field not in claim:
                    errors.append(f"{prefix}.{field} is required")
            claim_id = claim.get("claim_id")
            if not _is_nonempty_string(claim_id):
                errors.append(f"{prefix}.claim_id must be a non-empty string")
            elif claim_id in claim_ids:
                errors.append(f"{prefix}.claim_id is duplicated")
            else:
                claim_ids.add(claim_id)
            claim_refs = claim.get("evidence_refs")
            if not isinstance(claim_refs, list) or not claim_refs:
                errors.append(f"{prefix}.evidence_refs must be a non-empty list")
            else:
                for ref_id in claim_refs:
                    if ref_id not in evidence_ids:
                        errors.append(f"{prefix}.evidence_refs contains unknown evidence ID")
            if "verification_id" in claim and not _is_nonempty_string(claim["verification_id"]):
                errors.append(f"{prefix}.verification_id must be a non-empty string")
    verification = record.get("verification")
    verification_ids: Set[str] = set()
    if not isinstance(verification, list):
        errors.append("verification must be a list")
    else:
        for index, item in enumerate(verification):
            prefix = f"verification[{index}]"
            if not _is_mapping(item):
                errors.append(f"{prefix} must be an object")
                continue
            verification_id = item.get("verification_id")
            if not _is_nonempty_string(verification_id):
                errors.append(f"{prefix}.verification_id must be a non-empty string")
            elif verification_id in verification_ids:
                errors.append(f"{prefix}.verification_id is duplicated")
            else:
                verification_ids.add(verification_id)
    if isinstance(claims, list):
        for index, claim in enumerate(claims):
            if _is_mapping(claim) and "verification_id" in claim and claim["verification_id"] not in verification_ids:
                errors.append(f"claims[{index}].verification_id references unknown verification ID")
    provenance = record.get("provenance")
    if not _is_mapping(provenance):
        errors.append("record.provenance must be an object")
    else:
        derived = provenance.get("derived_from")
        if not isinstance(derived, list) or not all(_is_nonempty_string(item) for item in derived):
            errors.append("record.provenance.derived_from must be a list of IDs")
        if not _is_nonempty_string(provenance.get("reviewed_by")):
            errors.append("record.provenance.reviewed_by must be a non-empty string")


def validate_record(record: Any) -> List[str]:
    """Return sanitized field-level errors for one parsed frontmatter mapping."""
    if not _is_mapping(record):
        return ["frontmatter must be an object"]
    markers = [name for name in ("raw_schema", "canonical_schema") if name in record]
    if len(markers) != 1:
        return ["record must declare exactly one envelope schema"]
    errors: List[str] = []
    if markers[0] == "raw_schema":
        _validate_raw(record, errors)
    else:
        _validate_canonical(record, errors)
    return errors


def load_frontmatter(path: Path) -> Any:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        raise ValueError("frontmatter is missing")
    marker = "\n---\n"
    end = text.find(marker, 3)
    if end < 0:
        raise ValueError("frontmatter terminator is missing")
    return yaml.safe_load(text[4:end])


def validate_file(path: Path) -> List[str]:
    try:
        record = load_frontmatter(path)
    except (OSError, UnicodeError, ValueError, yaml.YAMLError):
        return ["frontmatter is unavailable or invalid"]
    return validate_record(record)


def content_digest(path: Path) -> Tuple[str, int]:
    """Return the digest and UTF-8 byte count of the stored body, excluding frontmatter."""
    text = path.read_text(encoding="utf-8")
    marker = "\n---\n"
    end = text.find(marker, 3)
    if end < 0:
        raise ValueError("frontmatter terminator is missing")
    body = text[end + len(marker):].encode("utf-8")
    return hashlib.sha256(body).hexdigest(), len(body)


def main(argv: Optional[List[str]] = None) -> int:
    """Validate one or more Markdown frontmatter envelopes without printing payloads."""
    paths = argv if argv is not None else sys.argv[1:]
    if not paths:
        print("usage: python scripts/kb_envelope_validator.py <markdown-file> [...]")
        return 2
    failed = False
    for value in paths:
        path = Path(value)
        errors = validate_file(path)
        if errors:
            failed = True
            print(f"{path}: INVALID ({len(errors)} error(s))")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"{path}: OK")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())

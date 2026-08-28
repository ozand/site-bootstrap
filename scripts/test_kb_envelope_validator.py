import copy
import tempfile
import unittest
from pathlib import Path

import yaml

from kb_envelope_validator import content_digest, validate_file, validate_record


class EnvelopeValidatorTests(unittest.TestCase):
    def raw_record(self):
        return {
            "raw_schema": "raw-v1",
            "capture_id": "RAW-20260828-example-a1b2c3",
            "status": "raw_capture",
            "source_type": "web",
            "source_url": "https://example.com/docs",
            "source_title": "Example docs",
            "author": None,
            "organization": "Example",
            "published_at": None,
            "updated_at": None,
            "captured_at": "2026-08-28T00:00:00Z",
            "source_version": "v1",
            "retrieval": {"method": "http", "tool": "curl", "tool_version": "1", "http_status": 200, "media_type": "text/html", "language": "en"},
            "content": {"representation": "markdown", "sha256": "a" * 64, "byte_count": 1, "excerpted": True, "transform": None},
            "provenance": {"captured_by": "test", "derived_from": None},
            "quality": {"source_quality": "high", "claim_status": "confirmed", "limitations": []},
            "rights": {"license": "unknown", "retention_note": "Minimal excerpt"},
            "tags": ["official"],
            "web": {"canonical_url": "https://example.com/docs", "publisher": "Example", "locator": "Overview", "response_validators": {"etag": None, "last_modified": None}},
        }

    def canonical_record(self):
        evidence = self.raw_record()
        return {
            "canonical_schema": "canonical-v1", "id": "KB-EXAMPLE-0001", "title": "Example", "category": "concept", "tags": ["example"], "status": "active", "created": "2026-08-28", "updated": "2026-08-28",
            "environment": {"os": "any", "shell": "any", "tools": ["test"]}, "version_scope": {"product": "example", "versions": ["1"], "environments": ["test"], "as_of": "2026-08-28", "applicability": "test"},
            "claims": [{"claim_id": "C-001", "text": "A bounded fact", "type": "api_contract", "status": "confirmed", "evidence_refs": ["RAW-EXAMPLE-0001"], "verification_id": "VR-001", "scope": "test"}],
            "evidence_refs": [{"evidence_id": "RAW-EXAMPLE-0001", "source_type": "web", "url": "https://example.com/docs", "captured_at": "2026-08-28T00:00:00Z", "source_version": "v1", "locator": {"kind": "heading", "value": "Overview"}, "notes": "test"}],
            "verification": [{"verification_id": "VR-001", "method": "docs_review", "performed_at": "2026-08-28T00:00:00Z", "result": "pass", "scope": "test", "output_ref": "RAW-EXAMPLE-0001", "notes": "test"}],
            "alternatives": [], "unresolved_conflicts": [], "supersedes": [], "superseded_by": None,
            "provenance": {"derived_from": ["RAW-EXAMPLE-0001"], "reviewed_by": "test"}, "error_signatures": [],
        }

    def test_valid_raw_and_canonical_records_are_accepted(self):
        self.assertEqual(validate_record(self.raw_record()), [])
        self.assertEqual(validate_record(self.canonical_record()), [])

    def test_malformed_and_ambiguous_records_are_rejected_without_payload_output(self):
        malformed = copy.deepcopy(self.raw_record())
        malformed.pop("retrieval")
        malformed["canonical_schema"] = "canonical-v1"
        malformed["content"]["sha256"] = "sha256:" + "a" * 64
        errors = validate_record(malformed)
        self.assertTrue(errors)
        self.assertTrue(any("exactly one envelope schema" in error or "canonical_schema" in error for error in errors))
        self.assertTrue(all("https://" not in error and "secret" not in error.lower() for error in errors))

    def test_unknown_claim_and_bad_locator_are_rejected(self):
        record = self.canonical_record()
        record["claims"][0]["evidence_refs"] = ["RAW-MISSING"]
        record["evidence_refs"][0]["locator"]["kind"] = "unknown"
        errors = validate_record(record)
        self.assertTrue(any("unknown evidence ID" in error for error in errors))
        self.assertTrue(any("locator.kind is invalid" in error for error in errors))

    def test_file_digest_excludes_frontmatter(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "record.md"
            body = "\n# Safe body\n"
            record = self.raw_record()
            record["content"]["byte_count"] = len(body.encode())
            import hashlib
            record["content"]["sha256"] = hashlib.sha256(body.encode()).hexdigest()
            path.write_text("---\n" + yaml.safe_dump(record, sort_keys=False) + "---\n" + body, encoding="utf-8")
            self.assertEqual(content_digest(path), (record["content"]["sha256"], record["content"]["byte_count"]))
            self.assertEqual(validate_file(path), [])


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
"""Verify scaffold scope and safe reuse of runtime-only target entries."""

import os
import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCAFFOLDER = ROOT / "scripts" / "create-site.mjs"
EXPECTED_ABSENT = ("qmd.json", "qmd", ".qmd", "kb")
EXPECTED_PRESENT = ("package.json", ".gitignore", "AGENTS.md", "CLAUDE.md", ".agents/skills")


def run_scaffolder(target: Path, *, no_git: bool = True) -> subprocess.CompletedProcess[str]:
    command = [
        "node",
        str(SCAFFOLDER),
        "--name",
        "scope-test",
        "--domain",
        "example.com",
        "--target",
        str(target),
    ]
    if no_git:
        command.append("--no-git")
    return subprocess.run(
        command,
        cwd=ROOT,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="site-bootstrap-scope-") as temp_dir:
        temp_root = Path(temp_dir)

        target = temp_root / "generated-site"
        result = run_scaffolder(target)
        assert result.returncode == 0, result.stderr
        for relative in EXPECTED_PRESENT:
            assert (target / relative).exists(), f"expected scaffold output missing: {relative}"
        for relative in EXPECTED_ABSENT:
            assert not (target / relative).exists(), f"workspace asset leaked into scaffold: {relative}"

        runtime_target = temp_root / "runtime-target"
        runtime_target.mkdir()
        runtime_dir = runtime_target / ".pi"
        runtime_dir.mkdir()
        sentinel = runtime_dir / "session.jsonl"
        sentinel.write_text("preserve", encoding="utf-8")

        # Windows reserves the device name. On Windows, the directory-entry
        # allowlist is still covered by the scaffolder's readdir check; avoid
        # opening a reserved device path in the test process.
        nul_entry = runtime_target / "nul"
        if os.name != "nt":
            nul_entry.write_text("preserve", encoding="utf-8")

        result = run_scaffolder(runtime_target, no_git=False)
        assert result.returncode == 0, result.stderr
        assert sentinel.read_text(encoding="utf-8") == "preserve"
        if os.name != "nt":
            assert nul_entry.read_text(encoding="utf-8") == "preserve"

        assert (runtime_target / "package.json").exists()
        ignored = subprocess.run(
            ["git", "-C", str(runtime_target), "check-ignore", ".pi/session.jsonl", "nul"],
            check=False,
            capture_output=True,
            text=True,
        )
        assert ignored.returncode == 0, ignored.stdout + ignored.stderr
        tracked = subprocess.run(
            ["git", "-C", str(runtime_target), "ls-files", "--error-unmatch", ".pi/session.jsonl"],
            check=False,
            capture_output=True,
            text=True,
        )
        assert tracked.returncode != 0, tracked.stdout + tracked.stderr
        if os.name != "nt":
            tracked_nul = subprocess.run(
                ["git", "-C", str(runtime_target), "ls-files", "--error-unmatch", "nul"],
                check=False,
                capture_output=True,
                text=True,
            )
            assert tracked_nul.returncode != 0, tracked_nul.stdout + tracked_nul.stderr

        unsafe = temp_root / "unsafe-target"
        unsafe.mkdir()
        marker = unsafe / "unrelated.txt"
        marker.write_text("must remain", encoding="utf-8")
        result = run_scaffolder(unsafe)
        assert result.returncode != 0
        assert marker.read_text(encoding="utf-8") == "must remain"
        assert not (unsafe / "package.json").exists()


if __name__ == "__main__":
    main()
    print("scaffold scope: PASS")

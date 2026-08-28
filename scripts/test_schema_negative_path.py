#!/usr/bin/env python3
"""Exercise the generated Astro content schema with invalid fixtures and restore it."""

from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCAFFOLDER = ROOT / "scripts" / "create-site.mjs"
POST_RELATIVE = Path("src/content/posts/hello-world.mdoc")


def resolve_executable(name: str) -> str:
    """Resolve native executables and Windows command shims without shell use."""
    return shutil.which(name) or shutil.which(f"{name}.cmd") or name


def run(command: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    resolved = [resolve_executable(command[0]), *command[1:]]
    return subprocess.run(
        resolved,
        cwd=cwd,
        text=True,
        capture_output=True,
        check=False,
    )


def combined_output(result: subprocess.CompletedProcess[str]) -> str:
    return f"{result.stdout}\n{result.stderr}"


def assert_valid(result: subprocess.CompletedProcess[str], label: str) -> None:
    if result.returncode != 0:
        raise AssertionError(f"{label} fixture did not validate")


def assert_invalid(result: subprocess.CompletedProcess[str], marker: str) -> None:
    output = combined_output(result)
    if result.returncode == 0:
        raise AssertionError(f"invalid fixture unexpectedly passed: {marker}")
    if marker not in output:
        raise AssertionError(f"invalid fixture failure did not mention {marker}")


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="site-bootstrap-schema-") as temp_dir:
        target = Path(temp_dir) / "schema-test"
        scaffold = run(
            [
                "node",
                str(SCAFFOLDER),
                "--name",
                "schema-test",
                "--domain",
                "example.com",
                "--target",
                str(target),
                "--no-git",
            ],
            ROOT,
        )
        if scaffold.returncode != 0:
            raise AssertionError("scaffolder failed")

        install = run(["npm", "ci", "--ignore-scripts"], target)
        if install.returncode != 0:
            raise AssertionError("clean fixture install failed")

        post = target / POST_RELATIVE
        original = post.read_text(encoding="utf-8")
        valid = run(["npm", "run", "check"], target)
        assert_valid(valid, "valid")

        try:
            missing_required = original.replace("title: Hello World\n", "", 1)
            post.write_text(missing_required, encoding="utf-8")
            assert_invalid(run(["npm", "run", "check"], target), "title")

            invalid_type = original.replace("draft: false\n", "draft: not-a-boolean\n", 1)
            post.write_text(invalid_type, encoding="utf-8")
            assert_invalid(run(["npm", "run", "check"], target), "draft")

            invalid_boundary = original.replace("pubDate: 2026-01-01\n", "pubDate: not-a-date\n", 1)
            post.write_text(invalid_boundary, encoding="utf-8")
            assert_invalid(run(["npm", "run", "check"], target), "pubDate")
        finally:
            post.write_text(original, encoding="utf-8")

        restored = run(["npm", "run", "check"], target)
        assert_valid(restored, "restored")

    print("schema negative-path: PASS (valid → missing field/type/boundary failures → restored valid)")


if __name__ == "__main__":
    main()

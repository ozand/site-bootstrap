#!/usr/bin/env python3
"""Verify that scaffolding does not inherit the bootstrap KB/QMD workspace."""

import shutil
import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCAFFOLDER = ROOT / "scripts" / "create-site.mjs"
EXPECTED_ABSENT = ("qmd.json", "qmd", ".qmd", "kb")
EXPECTED_PRESENT = ("package.json", ".gitignore", "AGENTS.md", "CLAUDE.md", ".agents/skills")


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="site-bootstrap-scope-") as temp_dir:
        target = Path(temp_dir) / "generated-site"
        subprocess.run(
            [
                "node",
                str(SCAFFOLDER),
                "--name",
                "scope-test",
                "--domain",
                "example.com",
                "--target",
                str(target),
                "--no-git",
            ],
            cwd=ROOT,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        for relative in EXPECTED_PRESENT:
            assert (target / relative).exists(), f"expected scaffold output missing: {relative}"
        for relative in EXPECTED_ABSENT:
            assert not (target / relative).exists(), f"workspace asset leaked into scaffold: {relative}"



if __name__ == "__main__":
    main()
    print("scaffold scope: PASS")

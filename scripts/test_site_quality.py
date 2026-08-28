#!/usr/bin/env python3
"""Run a disposable, localhost-only SEO/a11y/performance acceptance check."""

from __future__ import annotations

import json
import os
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SCAFFOLDER = ROOT / "scripts" / "create-site.mjs"
NODE = shutil.which("node") or "node"
NPM = shutil.which("npm.cmd") or shutil.which("npm") or "npm"
ROUTES = ("/", "/blog", "/keystatic")
LOAD_BUDGET_MS = 3000


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def run(command: list[str], cwd: Path, *, env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, cwd=cwd, env=env, text=True, capture_output=True, check=False)


def wait_for_server(url: str, process: subprocess.Popen[str]) -> None:
    deadline = time.time() + 30
    while time.time() < deadline:
        if process.poll() is not None:
            raise RuntimeError(f"server exited with code {process.returncode}")
        try:
            with urllib.request.urlopen(url, timeout=2) as response:
                if response.status < 500:
                    return
        except (urllib.error.URLError, TimeoutError):
            time.sleep(0.25)
    raise TimeoutError(f"server did not become ready: {url}")


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="site-bootstrap-quality-") as temp_dir:
        target = Path(temp_dir) / "quality-site"
        scaffold = run(
            [
                NODE, str(SCAFFOLDER), "--name", "quality-test",
                "--domain", "example.com", "--target", str(target), "--no-git",
            ],
            ROOT,
        )
        if scaffold.returncode != 0:
            raise RuntimeError(f"scaffold failed: {scaffold.stderr[-1000:]}")

        install = run([NPM, "ci", "--no-audit", "--no-fund"], target)
        if install.returncode != 0:
            raise RuntimeError(f"npm ci failed: {install.stderr[-1000:]}")
        verify = run([NPM, "run", "verify"], target)
        build = run([NPM, "run", "build"], target)
        if verify.returncode != 0 or build.returncode != 0:
            raise RuntimeError(
                f"verification failed: verify={verify.returncode}, build={build.returncode}"
            )

        port = free_port()
        env = os.environ.copy()
        env.update({"HOST": "127.0.0.1", "PORT": str(port), "NODE_ENV": "production"})
        server = subprocess.Popen(
            [NODE, "dist/server/entry.mjs"],
            cwd=target,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        try:
            base = f"http://127.0.0.1:{port}"
            wait_for_server(base + "/", server)
            report: dict[str, object] = {
                "methodology": {
                    "environment": "disposable generated scaffold; localhost only",
                    "routes": list(ROUTES),
                    "performance_metric": "browser loadEventEnd - startTime",
                    "performance_budget_ms": LOAD_BUDGET_MS,
                    "accessibility_scope": "basic DOM/keyboard smoke; no axe/WCAG certification",
                },
                "checks": {
                    "verify": "pass",
                    "build": "pass",
                    "seo": {},
                    "accessibility": {},
                    "performance": {},
                },
            }

            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(headless=True)
                page = browser.new_page()
                for route in ROUTES:
                    response = page.goto(base + route, wait_until="networkidle")
                    if response is None or response.status >= 400:
                        raise RuntimeError(f"route failed: {route}")
                    title = page.title().strip()
                    description = page.locator('meta[name="description"]').count()
                    viewport = page.locator('meta[name="viewport"]').count()
                    sitemap = page.locator('link[rel="sitemap"]').count()
                    missing_alt = page.locator('img:not([alt])').count()
                    invalid_links = page.locator('a:not([href])').count()
                    h1_count = page.locator('h1').count()
                    page.keyboard.press("Tab")
                    focused = page.evaluate("document.activeElement?.tagName || null")
                    navigation = page.evaluate(
                        """() => {
                            const n = performance.getEntriesByType('navigation')[0];
                            return n ? {start: n.startTime, end: n.loadEventEnd} : null;
                        }"""
                    )
                    load_ms = None if not navigation else round(navigation["end"] - navigation["start"], 2)
                    report["checks"]["seo"][route] = {
                        "status": "pass",
                        "title": bool(title),
                        "description": bool(description),
                        "viewport": bool(viewport),
                        "sitemap_link": bool(sitemap),
                        "h1_count": h1_count,
                    }
                    report["checks"]["accessibility"][route] = {
                        "status": "pass" if missing_alt == 0 and invalid_links == 0 and focused else "fail",
                        "missing_alt": missing_alt,
                        "links_without_href": invalid_links,
                        "first_tab_focus": focused,
                    }
                    report["checks"]["performance"][route] = {
                        "status": "pass" if load_ms is not None and load_ms <= LOAD_BUDGET_MS else "fail",
                        "load_ms": load_ms,
                    }
                browser.close()

            for sitemap_path in ("dist/client/sitemap-index.xml", "dist/client/sitemap-0.xml"):
                if not (target / sitemap_path).exists():
                    report["checks"]["seo"]["status"] = "fail"
                    report["checks"]["seo"]["missing_sitemap"] = sitemap_path
            print(json.dumps(report, indent=2, sort_keys=True))
            return 0 if all(
                item.get("status") == "pass"
                for category in ("seo", "accessibility", "performance")
                for item in report["checks"][category].values()
                if isinstance(item, dict) and "status" in item
            ) else 1
        finally:
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()
                server.wait(timeout=5)


if __name__ == "__main__":
    raise SystemExit(main())

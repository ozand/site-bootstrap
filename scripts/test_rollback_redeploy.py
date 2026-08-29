#!/usr/bin/env python3
"""Exercise a disposable Node SSR rollback/redeploy cycle with HTTP health checks."""

from __future__ import annotations

import os
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAFFOLDER = ROOT / "scripts" / "create-site.mjs"
NODE = shutil.which("node") or "node.exe" or "node"
NPM = shutil.which("npm.cmd") or shutil.which("npm") or "npm"


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def run(command: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)


def wait_health(port: int, process: subprocess.Popen[str]) -> int:
    url = f"http://127.0.0.1:{port}/"
    deadline = time.time() + 30
    while time.time() < deadline:
        if process.poll() is not None:
            raise AssertionError(f"server exited with code {process.returncode}")
        try:
            with urllib.request.urlopen(url, timeout=2) as response:
                return response.status
        except Exception:
            time.sleep(0.25)
    raise AssertionError("server health check timed out")


def start_server(target: Path, port: int) -> subprocess.Popen[str]:
    environment = os.environ.copy()
    environment.update({"HOST": "127.0.0.1", "PORT": str(port), "NODE_ENV": "production"})
    return subprocess.Popen(
        [NODE, "dist/server/entry.mjs"],
        cwd=target,
        env=environment,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def stop_server(process: subprocess.Popen[str]) -> None:
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="site-bootstrap-rollback-") as temp_dir:
        target = Path(temp_dir) / "rollback-site"
        scaffold = run([NODE, str(SCAFFOLDER), "--name", "rollback-test", "--domain", "example.com", "--target", str(target), "--no-git"], ROOT)
        assert scaffold.returncode == 0, scaffold.stderr
        assert run([NPM, "ci", "--ignore-scripts"], target).returncode == 0
        assert run([NPM, "run", "build"], target).returncode == 0

        post = target / "src/content/posts/hello-world.mdoc"
        known_good = post.read_text(encoding="utf-8")
        port = free_port()
        server = start_server(target, port)
        try:
            assert wait_health(port, server) == 200
        finally:
            stop_server(server)

        changed = known_good.replace("Welcome to", "Controlled rollback test change: Welcome to", 1)
        post.write_text(changed, encoding="utf-8")
        assert run([NPM, "run", "build"], target).returncode == 0
        server = start_server(target, port)
        try:
            assert wait_health(port, server) == 200
        finally:
            stop_server(server)

        post.write_text(known_good, encoding="utf-8")
        assert post.read_text(encoding="utf-8") == known_good
        assert run([NPM, "run", "build"], target).returncode == 0
        server = start_server(target, port)
        try:
            assert wait_health(port, server) == 200
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/blog/hello-world", timeout=5) as response:
                assert response.status == 200
        finally:
            stop_server(server)

    print("rollback/redeploy: PASS (known-good → controlled change → rollback → redeploy → HTTP health)")


if __name__ == "__main__":
    main()

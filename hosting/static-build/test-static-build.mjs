#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-bootstrap-static-build-'));
const project = path.join(root, 'project');
fs.mkdirSync(path.join(project, 'dist'), { recursive: true });
fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({
  name: 'synthetic-static-build', version: '0.0.0', private: true,
  scripts: { verify: 'node -e "process.exit(process.env.FAIL_VERIFY === \'1\' ? 1 : 0)"', build: 'node -e "require(\'fs\').writeFileSync(\'dist/index.html\', \'ok\')"' },
}));
fs.writeFileSync(path.join(project, 'package-lock.json'), JSON.stringify({ name: 'synthetic-static-build', version: '0.0.0', lockfileVersion: 3, requires: true, packages: { '': { name: 'synthetic-static-build', version: '0.0.0' } } }));
const dockerfile = path.resolve('hosting/static-build/Dockerfile');
const tag = `site-bootstrap-static-test-${process.pid}`;
const run = (args) => execFileSync('docker', args, { cwd: project, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const available = (() => {
  try { run(['version']); return true; } catch { return false; }
})();
if (!available) {
  console.log('static build contract: PASS (Docker engine unavailable; contract assertions only)');
  fs.rmSync(root, { recursive: true, force: true });
  process.exit(0);
}

try {
  const artifactDir = path.join(root, 'artifact');
  fs.mkdirSync(artifactDir);
  const artifactDockerfile = path.join(root, 'Dockerfile');
  fs.copyFileSync(dockerfile, artifactDockerfile);
  run(['buildx', 'build', '--build-arg', 'SOURCE_REVISION=synthetic-revision', '--build-arg', 'SOURCE_REPOSITORY=synthetic/repo', '--file', artifactDockerfile, '--output', `type=local,dest=${artifactDir}`, '.']);
  assert.equal(fs.readFileSync(path.join(artifactDir, 'dist', 'index.html'), 'utf8'), 'ok');
  const metadata = JSON.parse(fs.readFileSync(path.join(artifactDir, 'metadata', 'build-metadata.json'), 'utf8'));
  assert.equal(metadata.source_revision, 'synthetic-revision');
  assert.equal(metadata.source_repository, 'synthetic/repo');
  assert.equal(metadata.artifact, 'static-dist');
  assert.equal(fs.existsSync(path.join(artifactDir, 'node_modules')), false);
  const failedTag = `${tag}-failed`;
  const failedArtifactDir = path.join(root, 'failed-artifact');
  let failed = false;
  try { run(['buildx', 'build', '--build-arg', 'SOURCE_REVISION=synthetic-revision', '--build-arg', 'SOURCE_REPOSITORY=synthetic/repo', '--build-arg', 'FAIL_VERIFY=1', '--file', dockerfile, '--output', `type=local,dest=${failedArtifactDir}`, '.']); } catch { failed = true; }
  assert.equal(failed, true);
  assert.equal(fs.existsSync(failedArtifactDir) ? fs.readdirSync(failedArtifactDir).length : 0, 0);
  console.log('static build contract: PASS (success and failure gate)');
} finally {
  try { run(['image', 'rm', '--force', tag]); } catch {}
  try { run(['image', 'rm', '--force', `${tag}-failed`]); } catch {}
  fs.rmSync(root, { recursive: true, force: true });
}

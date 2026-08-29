#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-bootstrap-publish-'));
const script = path.resolve('hosting/vps/publish-static-release.mjs');
const artifact = path.join(root, 'artifact');
const releaseRoot = path.join(root, 'releases-root');
fs.mkdirSync(artifact, { recursive: true });
fs.writeFileSync(path.join(artifact, 'index.html'), '<h1>first</h1>\n');
fs.mkdirSync(path.join(artifact, 'assets'));
fs.writeFileSync(path.join(artifact, 'assets', 'app.js'), 'console.log(1);\n');

const run = (args) => execFileSync(process.execPath, [script, ...args], {
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
});
const failed = (args) => {
  try { run(args); return false; } catch { return true; }
};
const pointer = () => fs.realpathSync(path.join(releaseRoot, 'current'));

try {
  const first = JSON.parse(run(['--artifact', artifact, '--root', releaseRoot, '--release', 'release-001', '--retain', '2']));
  assert.equal(first.status, 'published');
  assert.equal(first.files, 2);
  assert.equal(fs.readFileSync(path.join(releaseRoot, 'releases', 'release-001', 'index.html'), 'utf8'), '<h1>first</h1>\n');
  assert.equal(pointer(), path.join(releaseRoot, 'releases', 'release-001'));

  const invalid = path.join(root, 'invalid');
  fs.mkdirSync(invalid);
  fs.writeFileSync(path.join(invalid, 'not-index.txt'), 'invalid');
  assert.equal(failed(['--artifact', invalid, '--root', releaseRoot, '--release', 'release-002']), true);
  assert.equal(pointer(), path.join(releaseRoot, 'releases', 'release-001'));
  assert.equal(fs.existsSync(path.join(releaseRoot, 'releases', 'release-002')), false);

  const second = path.join(root, 'second');
  fs.mkdirSync(second);
  fs.writeFileSync(path.join(second, 'index.html'), '<h1>second</h1>\n');
  JSON.parse(run(['--artifact', second, '--root', releaseRoot, '--release', 'release-002', '--retain', '1']));
  assert.equal(pointer(), path.join(releaseRoot, 'releases', 'release-002'));
  assert.equal(fs.existsSync(path.join(releaseRoot, 'releases', 'release-001')), true);
  assert.equal(fs.existsSync(path.join(releaseRoot, 'releases', '.staging-release-002')), false);
  assert.equal(fs.readFileSync(path.join(releaseRoot, 'current', 'index.html'), 'utf8'), '<h1>second</h1>\n');

  const third = path.join(root, 'third');
  fs.mkdirSync(third);
  fs.writeFileSync(path.join(third, 'index.html'), '<h1>third</h1>\n');
  JSON.parse(run(['--artifact', third, '--root', releaseRoot, '--release', 'release-003', '--retain', '1']));
  assert.equal(pointer(), path.join(releaseRoot, 'releases', 'release-003'));
  assert.equal(fs.existsSync(path.join(releaseRoot, 'releases', 'release-001')), false);
  assert.equal(fs.existsSync(path.join(releaseRoot, 'releases', 'release-002')), true);
  assert.equal(fs.readFileSync(path.join(releaseRoot, 'current', 'index.html'), 'utf8'), '<h1>third</h1>\n');

  assert.equal(failed(['--artifact', third, '--root', releaseRoot, '--release', '../escape']), true);
  assert.equal(fs.existsSync(path.join(root, 'escape')), false);
  console.log('publish static release: PASS (success, invalid artifact gate, atomic pointer, retention, traversal rejection, cleanup)');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

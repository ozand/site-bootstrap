#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-bootstrap-rollback-'));
const artifactRoot = path.join(root, 'artifacts');
const releaseRoot = path.join(root, 'releases');
fs.mkdirSync(artifactRoot, { recursive: true });
const publisher = path.resolve('hosting/vps/publish-static-release.mjs');
const runPublisher = (artifact, release) => execFileSync(process.execPath, [publisher, '--artifact', artifact, '--root', releaseRoot, '--release', release, '--retain', '2'], { encoding: 'utf8' });
const writeArtifact = (name, body) => {
  const dir = path.join(artifactRoot, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), body);
  return dir;
};

const releaseOne = runPublisher(writeArtifact('one', '<h1>release-one</h1>\n'), 'release-one');
assert.match(releaseOne, /"status": "published"/);
const releaseTwo = runPublisher(writeArtifact('two', '<h1>release-two</h1>\n'), 'release-two');
assert.match(releaseTwo, /"status": "published"/);
assert.equal(fs.readFileSync(path.join(releaseRoot, 'current', 'index.html'), 'utf8'), '<h1>release-two</h1>\n');
const currentBefore = fs.realpathSync(path.join(releaseRoot, 'current'));
assert.match(currentBefore, /release-two/);

const server = http.createServer((request, response) => {
  const file = path.join(releaseRoot, 'current', request.url === '/' ? 'index.html' : request.url.slice(1));
  if (!file.startsWith(path.resolve(releaseRoot, 'current'))) { response.writeHead(400); response.end(); return; }
  if (!fs.existsSync(file)) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const get = (pathName) => new Promise((resolve, reject) => {
  http.get(`http://127.0.0.1:${port}${pathName}`, (response) => {
    let body = '';
    response.on('data', (chunk) => { body += chunk; });
    response.on('end', () => resolve({ status: response.statusCode, body }));
  }).on('error', reject);
});
const before = await get('/');
assert.equal(before.status, 200);
assert.match(before.body, /release-two/);

const failedArtifact = path.join(artifactRoot, 'failed');
fs.mkdirSync(failedArtifact);
let failed = false;
try { runPublisher(failedArtifact, 'release-failed'); } catch { failed = true; }
assert.equal(failed, true);
assert.equal(fs.realpathSync(path.join(releaseRoot, 'current')), currentBefore);
assert.equal(fs.existsSync(path.join(releaseRoot, 'releases', 'release-failed')), false);

// Rollback is an atomic selector switch to the retained known-good release.
const rollbackLink = path.join(releaseRoot, 'current.rollback');
fs.symlinkSync(path.join('releases', 'release-one'), rollbackLink, 'junction');
fs.rmSync(path.join(releaseRoot, 'current'), { recursive: true, force: true });
fs.renameSync(rollbackLink, path.join(releaseRoot, 'current'));
const after = await get('/');
assert.equal(after.status, 200);
assert.match(after.body, /release-one/);
assert.match(fs.realpathSync(path.join(releaseRoot, 'current')), /release-one/);
server.close();
fs.rmSync(root, { recursive: true, force: true });
console.log('static rollback: PASS (two releases, failed publish preserves current, atomic rollback, HTTP health)');

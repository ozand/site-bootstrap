#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-bootstrap-trigger-'));
const script = path.resolve('hosting/static-build/run-publish-trigger.mjs');
const event = path.join(root, 'push.json');
const acceptedEvent = {
  event_type: 'push', ref: 'refs/heads/main', before: '1111111111111111111111111111111111111111',
  after: '2222222222222222222222222222222222222222', repository: { full_name: 'synthetic/example' },
};
fs.writeFileSync(event, JSON.stringify(acceptedEvent));
const artifact = path.join(root, 'artifact');
const marker = path.join(root, 'publish-marker');
const command = (value) => `node -e "require('fs').mkdirSync('${value.replaceAll('\\', '/')}', {recursive:true}); require('fs').writeFileSync('${marker.replaceAll('\\', '/')}', process.env.TRIGGER_RELEASE_ID)"`;
const run = (args) => execFileSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const failed = (args) => { try { run(args); return false; } catch { return true; } };
try {
  const ignored = path.join(root, 'ignored.json');
  fs.writeFileSync(ignored, JSON.stringify({ ...acceptedEvent, ref: 'refs/heads/feature' }));
  const ignoredResult = JSON.parse(run(['--event', ignored, '--build', command(artifact), '--artifact', artifact, '--publish', command('published') ]));
  assert.equal(ignoredResult.status, 'ignored');
  assert.equal(fs.existsSync(marker), false);

  const published = JSON.parse(run(['--event', event, '--build', command(artifact), '--artifact', artifact, '--publish', command('published') ]));
  assert.equal(published.status, 'published');
  assert.equal(fs.readFileSync(marker, 'utf8'), acceptedEvent.after);

  fs.rmSync(marker);
  assert.equal(failed(['--event', event, '--build', 'node -e "process.exit(7)"', '--artifact', artifact, '--publish', command('published') ]), true);
  assert.equal(fs.existsSync(marker), false);

  fs.rmSync(artifact, { recursive: true, force: true });
  assert.equal(failed(['--event', event, '--build', 'node -e "process.exit(0)"', '--artifact', artifact, '--publish', command('published') ]), true);
  assert.equal(fs.existsSync(marker), false);
  console.log('publish trigger: PASS (main push accepted, branch filtered, build failure gate, missing artifact gate, sanitized release env)');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

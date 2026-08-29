#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-bootstrap-nginx-'));
const release = path.join(root, 'current');
const config = path.join(root, 'nginx.conf');
const prefix = path.join(root, 'nginx-prefix');
fs.mkdirSync(release, { recursive: true });
fs.writeFileSync(path.join(release, 'index.html'), '<h1>synthetic release</h1>\n');
fs.mkdirSync(path.join(release, 'blog'), { recursive: true });
fs.writeFileSync(path.join(release, 'blog', 'index.html'), '<h1>synthetic blog</h1>\n');
const template = fs.readFileSync(path.resolve('hosting/vps/nginx-static.conf'), 'utf8');
const rendered = template.replace('/srv/example-release-root/current', release.replaceAll('\\', '/'));
fs.writeFileSync(config, rendered);

assert.match(rendered, /root .*\/current;/);
assert.match(rendered, /location = \/keystatic \{ return 404; \}/);
assert.match(rendered, /location \^~ \/keystatic\/ \{ return 404; \}/);
assert.match(rendered, /try_files \$uri \$uri\/ =404;/);
assert.doesNotMatch(rendered, /proxy_pass\s/);
assert.match(rendered, /autoindex off;/);

let nginx;
try { nginx = execFileSync('nginx', ['-v'], { encoding: 'utf8', stdio: 'pipe' }); } catch { nginx = null; }
if (nginx !== null) {
  const result = spawn('nginx', ['-t', '-p', `${prefix}/`, '-c', config], { stdio: 'pipe' });
  let stderr = '';
  result.stderr.on('data', (chunk) => { stderr += chunk; });
  await new Promise((resolve) => result.on('close', resolve));
  assert.equal(result.exitCode, 0, stderr);
}

fs.rmSync(root, { recursive: true, force: true });
console.log(`nginx static contract: PASS (${nginx === null ? 'deterministic assertions; nginx unavailable' : 'nginx -t'})`);

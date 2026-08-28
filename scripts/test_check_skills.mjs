#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { compare, manifest } from './check-skills.mjs';

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'site-bootstrap-skills-'));
const source = path.join(temp, 'source');
const target = path.join(temp, 'target');
fs.mkdirSync(path.join(source, 'alpha'), { recursive: true });
fs.mkdirSync(path.join(target, 'alpha'), { recursive: true });
fs.writeFileSync(path.join(source, 'alpha', 'SKILL.md'), 'same\n');
fs.writeFileSync(path.join(target, 'alpha', 'SKILL.md'), 'same\n');

const sourceManifest = manifest(source);
const targetManifest = manifest(target);
assert.equal(sourceManifest.length, 1);
assert.equal(sourceManifest[0].sha256, crypto.createHash('sha256').update('same\n').digest('hex'));
assert.deepEqual(compare(sourceManifest, targetManifest, new Map()), []);

fs.writeFileSync(path.join(target, 'alpha', 'SKILL.md'), 'changed\n');
let differences = compare(sourceManifest, manifest(target), new Map());
assert.equal(differences.length, 1);
assert.equal(differences[0].kind, 'changed');
assert.equal(differences[0].intentional, false);

const exceptions = new Map([['alpha', 'Intentional local adaptation']]);
differences = compare(sourceManifest, manifest(target), exceptions);
assert.equal(differences.length, 1);
assert.equal(differences[0].intentional, true);
assert.equal(differences[0].reason, 'Intentional local adaptation');

fs.rmSync(temp, { recursive: true, force: true });
console.log('skills manifest: matching, drift, and intentional divergence PASS');

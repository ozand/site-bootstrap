#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('templates/base-astro');
const publicConfig = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
const editorConfig = fs.readFileSync(path.join(root, 'astro.config.editor.mjs'), 'utf8');
const envExample = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
const keystaticConfig = fs.readFileSync(path.join(root, 'keystatic.config.ts'), 'utf8');

assert.match(publicConfig, /output:\s*['"]static['"]/);
assert.doesNotMatch(publicConfig, /keystatic\(\)/);
assert.doesNotMatch(publicConfig, /@astrojs\/node/);
assert.match(editorConfig, /output:\s*['"]server['"]/);
assert.match(editorConfig, /keystatic\(\)/);
assert.match(editorConfig, /node\(\{\s*mode:\s*['"]standalone['"]/);
assert.match(keystaticConfig, /storage:\s*\{\s*kind:\s*['"]local['"]\s*\}/);
assert.match(keystaticConfig, /storage:\s*\{\s*kind:\s*['"]github['"]\s*,\s*repo:/);
for (const name of ['KEYSTATIC_GITHUB_CLIENT_ID', 'KEYSTATIC_GITHUB_CLIENT_SECRET', 'KEYSTATIC_SECRET', 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG']) {
  assert.match(envExample, new RegExp(`^#?\\s*${name}=`, 'm'));
}
assert.doesNotMatch(envExample, /KEYSTATIC_[A-Z_]+=[^\n]+/);
console.log('private editor host contract: PASS (public/editor split, GitHub-mode guidance, empty secret placeholders)');

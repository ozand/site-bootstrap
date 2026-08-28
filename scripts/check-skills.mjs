#!/usr/bin/env node
/**
 * Compare the portable skill snapshot with a generated site's copy.
 * This is a read-only check: it never synchronizes or overwrites files.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  console.error('Usage: node scripts/check-skills.mjs --target <site>/.agents/skills [--source <skills>] [--exceptions <json>]');
}

function parseArgs(argv) {
  const args = { source: path.join(ROOT, 'skills') };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--source') args.source = argv[++i];
    else if (arg === '--target') args.target = argv[++i];
    else if (arg === '--exceptions') args.exceptions = argv[++i];
    else if (arg === '--help') { usage(); process.exit(0); }
    else { throw new Error(`Unknown argument: ${arg}`); }
  }
  if (!args.target) throw new Error('--target is required');
  return args;
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function manifest(root) {
  const entries = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else entries.push({ path: path.relative(root, absolute).split(path.sep).join('/'), sha256: hashFile(absolute) });
    }
  }
  walk(root);
  return entries;
}

function readExceptions(file) {
  if (!file) return new Map();
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!value || value.version !== 1 || !Array.isArray(value.intentional_drift)) {
    throw new Error('exceptions must contain version: 1 and intentional_drift: []');
  }
  const result = new Map();
  for (const item of value.intentional_drift) {
    if (!item || typeof item.skill !== 'string' || typeof item.reason !== 'string' || !item.reason.trim()) {
      throw new Error('each intentional drift entry requires skill and non-empty reason');
    }
    result.set(item.skill, item.reason.trim());
  }
  return result;
}

function compare(sourceManifest, targetManifest, exceptions) {
  const source = new Map(sourceManifest.map((entry) => [entry.path, entry.sha256]));
  const target = new Map(targetManifest.map((entry) => [entry.path, entry.sha256]));
  const paths = [...new Set([...source.keys(), ...target.keys()])].sort();
  const differences = [];
  for (const relative of paths) {
    const sourceHash = source.get(relative);
    const targetHash = target.get(relative);
    if (sourceHash === targetHash) continue;
    const skill = relative.split('/')[0];
    differences.push({
      skill,
      path: relative,
      kind: sourceHash === undefined ? 'extra' : targetHash === undefined ? 'missing' : 'changed',
      source_sha256: sourceHash ?? null,
      target_sha256: targetHash ?? null,
      intentional: exceptions.has(skill),
      reason: exceptions.get(skill) ?? null,
    });
  }
  return differences;
}

function main(argv = process.argv.slice(2)) {
  let args;
  try { args = parseArgs(argv); } catch (error) { console.error(`ERROR: ${error.message}`); usage(); return 2; }
  const source = path.resolve(args.source);
  const target = path.resolve(args.target);
  try {
    if (!fs.statSync(source).isDirectory() || !fs.statSync(target).isDirectory()) throw new Error('source and target skill directories must exist');
    const exceptions = readExceptions(args.exceptions && path.resolve(args.exceptions));
    const sourceManifest = manifest(source);
    const targetManifest = manifest(target);
    const differences = compare(sourceManifest, targetManifest, exceptions);
    const unapproved = differences.filter((item) => !item.intentional);
    console.log(JSON.stringify({
      schema: 'skills-manifest-v1',
      source_files: sourceManifest.length,
      target_files: targetManifest.length,
      compared_skills: [...new Set(sourceManifest.concat(targetManifest).map((entry) => entry.path.split('/')[0]))].sort(),
      differences: differences.map(({ skill, path: relative, kind, source_sha256, target_sha256, intentional, reason }) => ({ skill, path: relative, kind, source_sha256, target_sha256, status: intentional ? 'intentional' : 'drift', reason })),
      result: unapproved.length === 0 ? 'OK' : 'DRIFT',
    }, null, 2));
    return unapproved.length === 0 ? 0 : 1;
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();

export { compare, manifest, main };

#!/usr/bin/env node
/**
 * Publish a verified static artifact into an atomic, versioned release tree.
 *
 * Usage:
 *   node publish-static-release.mjs --artifact <dist> --root <release-root>
 *     --release <release-id> [--retain <count>]
 *
 * The release root is a disposable or explicitly authorized target. The script
 * does not contact a provider, configure Nginx, or mutate a production host.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const REQUIRED_ENTRIES = ['index.html'];
const RELEASE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

function fail(message) {
  console.error(`publish-static-release: ERROR: ${message}`);
  process.exitCode = 1;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) throw new Error(`unexpected argument '${key}'`);
    const name = key.slice(2);
    if (name === 'retain') args.retain = Number(argv[++i]);
    else args[name] = argv[++i];
  }
  return args;
}

function resolveInside(root, candidate, label) {
  const rootResolved = path.resolve(root);
  const candidateResolved = path.resolve(candidate);
  const relative = path.relative(rootResolved, candidateResolved);
  if (relative === '' || (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))) {
    throw new Error(`${label} must be outside the release root`);
  }
  return candidateResolved;
}

function ensureSafeReleaseId(value) {
  if (!value || !RELEASE_ID.test(value) || value === '.' || value === '..' || value.includes('..')) {
    throw new Error('release must be a simple path-safe release identifier');
  }
}

function listFiles(root) {
  const result = [];
  function walk(current, relative) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const rel = relative ? path.join(relative, entry.name) : entry.name;
      if (entry.isSymbolicLink()) throw new Error(`symbolic links are not allowed: ${rel}`);
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full, rel);
      else if (entry.isFile()) result.push(rel);
      else throw new Error(`unsupported artifact entry: ${rel}`);
    }
  }
  walk(root, '');
  return result.sort();
}

function digest(root, files) {
  const hash = crypto.createHash('sha256');
  for (const relative of files) {
    const normalized = relative.split(path.sep).join('/');
    const data = fs.readFileSync(path.join(root, relative));
    hash.update(`${normalized}\0${data.length}\0`);
    hash.update(data);
  }
  return hash.digest('hex');
}

function validateArtifact(artifact) {
  if (!fs.existsSync(artifact) || !fs.statSync(artifact).isDirectory()) {
    throw new Error('artifact must be an existing directory');
  }
  const files = listFiles(artifact);
  if (!files.length) throw new Error('artifact is empty');
  for (const entry of REQUIRED_ENTRIES) {
    if (!files.includes(entry)) throw new Error(`artifact is missing ${entry}`);
  }
  return { files, digest: digest(artifact, files) };
}

function atomicSymlink(target, linkPath) {
  const temporary = `${linkPath}.next-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
  try {
    fs.symlinkSync(target, temporary, process.platform === 'win32' ? 'junction' : 'dir');
    if (fs.existsSync(linkPath)) {
      if (process.platform === 'win32') fs.rmSync(linkPath, { recursive: true, force: true });
      else fs.renameSync(temporary, linkPath);
    }
    if (fs.existsSync(temporary)) fs.renameSync(temporary, linkPath);
  } finally {
    if (fs.existsSync(temporary)) fs.rmSync(temporary, { recursive: true, force: true });
  }
}

function retainReleases(root, currentRelease, retain) {
  if (!Number.isInteger(retain) || retain < 1) return [];
  const releases = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && RELEASE_ID.test(entry.name))
    .map((entry) => entry.name)
    .filter((name) => name !== currentRelease)
    .sort()
    .reverse();
  const removed = [];
  for (const name of releases.slice(retain)) {
    fs.rmSync(path.join(root, name), { recursive: true, force: true });
    removed.push(name);
  }
  return removed;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (!args.artifact || !args.root || !args.release) throw new Error('--artifact, --root and --release are required');
  ensureSafeReleaseId(args.release);
  const root = path.resolve(args.root);
  const artifact = resolveInside(root, args.artifact, 'artifact');
  fs.mkdirSync(root, { recursive: true });
  const { files, digest: artifactDigest } = validateArtifact(artifact);
  const releaseDir = path.join(root, 'releases', args.release);
  if (fs.existsSync(releaseDir)) throw new Error(`release already exists: ${args.release}`);
  fs.mkdirSync(path.dirname(releaseDir), { recursive: true });
  const staging = path.join(root, 'releases', `.staging-${args.release}-${process.pid}`);
  try {
    fs.mkdirSync(staging);
    fs.cpSync(artifact, staging, { recursive: true, errorOnExist: true, force: false });
    const copied = validateArtifact(staging);
    if (copied.digest !== artifactDigest || copied.files.length !== files.length) throw new Error('staged artifact digest mismatch');
    fs.renameSync(staging, releaseDir);
    atomicSymlink(path.join('releases', args.release), path.join(root, 'current'));
    const currentPath = path.join(root, 'current');
    const currentTarget = fs.realpathSync(currentPath);
    if (currentTarget !== fs.realpathSync(releaseDir)) throw new Error('current pointer verification failed');
    const removed = retainReleases(path.join(root, 'releases'), args.release, args.retain);
    console.log(JSON.stringify({ status: 'published', release: args.release, files: copied.files.length, digest: artifactDigest, current: `releases/${args.release}`, removed }, null, 2));
  } catch (error) {
    if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true });
    throw error;
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

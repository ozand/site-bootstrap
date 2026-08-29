#!/usr/bin/env node
/**
 * Provider-neutral commit-to-publication trigger contract.
 *
 * Consumes a sanitized GitHub-like push event and invokes an injected build
 * command only for an approved branch/event. The publisher is invoked only
 * after the build succeeds and the artifact directory exists. No webhook
 * listener, provider client, secrets, or production endpoints are included.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) throw new Error(`unexpected argument '${key}'`);
    args[key.slice(2)] = argv[++i];
  }
  return args;
}

function parseCommandSpec(value, label) {
  let spec;
  try { spec = JSON.parse(value); } catch { throw new Error(`${label} must be a JSON argv array`); }
  if (!Array.isArray(spec) || spec.length === 0 || spec.some((part) => typeof part !== 'string' || part.length === 0)) {
    throw new Error(`${label} must be a non-empty JSON argv array of strings`);
  }
  return spec;
}

function run(spec, cwd, action) {
  const [executable, ...commandArgs] = spec;
  const result = spawnSync(executable, commandArgs, {
    cwd,
    shell: false,
    stdio: ['ignore', 'ignore', 'ignore'],
    env: {
      ...process.env,
      TRIGGER_EVENT_TYPE: action.event_type,
      TRIGGER_BRANCH: action.branch,
      TRIGGER_REPOSITORY: action.repository,
      TRIGGER_BEFORE: action.before,
      TRIGGER_AFTER: action.after,
      TRIGGER_RELEASE_ID: action.after,
    },
  });
  return result.status ?? 1;
}

function fail(message) {
  console.error(`run-publish-trigger: ERROR: ${message}`);
  process.exitCode = 1;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (!args.event || !args.build || !args.artifact || !args.publish) {
    throw new Error('--event, --build, --artifact and --publish are required');
  }
  if (args.repository && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(args.repository)) {
    throw new Error('--repository must be an owner/name value');
  }
  const event = JSON.parse(fs.readFileSync(path.resolve(args.event), 'utf8'));
  const expectedBranch = args.branch || 'main';
  const expectedRepository = args.repository || null;
  const ref = typeof event.ref === 'string' ? event.ref : null;
  const branch = ref?.startsWith('refs/heads/') ? ref.slice('refs/heads/'.length) : null;
  const eventType = event.event_type || event.event || null;
  const before = typeof event.before === 'string' ? event.before : null;
  const after = typeof event.after === 'string' ? event.after : null;
  const repository = typeof event.repository?.full_name === 'string' ? event.repository.full_name : null;
  const action = { event_type: eventType, branch, repository, before, after };
  const build = parseCommandSpec(args.build, 'build');
  const publish = parseCommandSpec(args.publish, 'publish');

  if (eventType !== 'push' || branch !== expectedBranch || (expectedRepository && repository !== expectedRepository) || !/^[0-9a-f]{40}$/i.test(after || '') || after === '0'.repeat(40)) {
    console.log(JSON.stringify({ status: 'ignored', reason: 'event-filter', ...action }, null, 2));
  } else {
    const buildStatus = run(build, path.dirname(path.resolve(args.event)), action);
    if (buildStatus !== 0) {
      console.log(JSON.stringify({ status: 'blocked', stage: 'build', reason: 'build-failed', ...action }, null, 2));
      process.exitCode = 1;
    } else if (!fs.existsSync(path.resolve(args.artifact)) || !fs.statSync(path.resolve(args.artifact)).isDirectory()) {
      console.log(JSON.stringify({ status: 'blocked', stage: 'artifact', reason: 'artifact-missing', ...action }, null, 2));
      process.exitCode = 1;
    } else {
      const publishStatus = run(publish, path.dirname(path.resolve(args.event)), action);
      if (publishStatus !== 0) {
        console.log(JSON.stringify({ status: 'failed', stage: 'publish', reason: 'publisher-failed', ...action }, null, 2));
        process.exitCode = 1;
      } else {
        console.log(JSON.stringify({ status: 'published', stage: 'publish', ...action }, null, 2));
        process.exitCode = 0;
      }
    }
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

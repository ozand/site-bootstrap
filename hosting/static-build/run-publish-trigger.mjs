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

function run(command, cwd, action) {
  const result = spawnSync(command, {
    cwd,
    shell: true,
    encoding: 'utf8',
    env: {
      ...process.env,
      TRIGGER_EVENT_TYPE: action.event_type || '',
      TRIGGER_BRANCH: action.branch || '',
      TRIGGER_REPOSITORY: action.repository || '',
      TRIGGER_BEFORE: action.before || '',
      TRIGGER_AFTER: action.after || '',
      TRIGGER_RELEASE_ID: action.after || '',
    },
  });
  return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
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
  const event = JSON.parse(fs.readFileSync(path.resolve(args.event), 'utf8'));
  const expectedBranch = args.branch || 'main';
  const branch = event.ref?.startsWith('refs/heads/') ? event.ref.slice('refs/heads/'.length) : null;
  const eventType = event.event_type || event.event || null;
  const before = event.before || null;
  const after = event.after || null;
  const repository = event.repository?.full_name || null;
  const action = { event_type: eventType, branch, repository, before, after };

  if (eventType !== 'push' || branch !== expectedBranch || !after || after === '0'.repeat(40)) {
    console.log(JSON.stringify({ status: 'ignored', reason: 'event-filter', ...action }, null, 2));
  } else {
    const build = run(args.build, path.dirname(path.resolve(args.event)), action);
    if (build.status !== 0) {
      console.log(JSON.stringify({ status: 'blocked', stage: 'build', reason: 'build-failed', ...action }, null, 2));
      process.exitCode = 1;
    } else if (!fs.existsSync(path.resolve(args.artifact)) || !fs.statSync(path.resolve(args.artifact)).isDirectory()) {
      console.log(JSON.stringify({ status: 'blocked', stage: 'artifact', reason: 'artifact-missing', ...action }, null, 2));
      process.exitCode = 1;
    } else {
      const publish = run(args.publish, path.dirname(path.resolve(args.event)), action);
      if (publish.status !== 0) {
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

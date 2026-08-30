#!/usr/bin/env node
/**
 * Scaffold a new site from a template in this repository.
 *
 * Usage:
 *   node scripts/create-site.mjs --name my-site --domain example.com --target ../my-site
 *
 * Options:
 *   --name      Site name (used as package name, brand, placeholder __SITE_NAME__). Required.
 *   --domain    Production domain (placeholder __SITE_DOMAIN__). Required.
 *   --target    Directory to create the site in. Required. May already contain only .pi or nul runtime entries.
 *   --template  Template folder under templates/ (default: base-astro).
 *   --no-git    Skip `git init` + initial commit.
 *   --no-skills Skip copying skills/ into <target>/.agents/skills/.
 *
 * After scaffolding, compare the snapshot with:
 *   node scripts/check-skills.mjs --target <target>/.agents/skills
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const args = { template: 'base-astro', git: true, skills: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--name') args.name = argv[++i];
    else if (a === '--domain') args.domain = argv[++i];
    else if (a === '--target') args.target = argv[++i];
    else if (a === '--template') args.template = argv[++i];
    else if (a === '--no-git') args.git = false;
    else if (a === '--no-skills') args.skills = false;
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return args;
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
if (!args.name) fail('--name is required');
if (!args.domain) fail('--domain is required');
if (!args.target) fail('--target is required');
if (!/^[a-z0-9][a-z0-9-]*$/.test(args.name))
  fail('--name must be kebab-case: lowercase letters, digits, hyphens');

const templateDir = path.join(ROOT, 'templates', args.template);
if (!fs.existsSync(templateDir)) fail(`Template not found: ${templateDir}`);

const targetDir = path.resolve(args.target);
const SAFE_RUNTIME_ENTRIES = new Set(['.pi', 'nul']);
if (fs.existsSync(targetDir)) {
  const existingEntries = fs.readdirSync(targetDir);
  const unsafeEntries = existingEntries.filter((entry) => !SAFE_RUNTIME_ENTRIES.has(entry));
  if (unsafeEntries.length > 0)
    fail('Target directory contains non-runtime content; refusing to overwrite');
}

console.log(`Scaffolding '${args.name}' from template '${args.template}'`);
console.log(`  → ${targetDir}`);

fs.cpSync(templateDir, targetDir, { recursive: true });

// _gitignore is stored under a neutral name so it doesn't affect this repo.
const giSrc = path.join(targetDir, '_gitignore');
if (fs.existsSync(giSrc)) fs.renameSync(giSrc, path.join(targetDir, '.gitignore'));

if (args.skills) {
  const skillsSrc = path.join(ROOT, 'skills');
  const skillsDst = path.join(targetDir, '.agents', 'skills');
  fs.mkdirSync(path.dirname(skillsDst), { recursive: true });
  fs.cpSync(skillsSrc, skillsDst, { recursive: true });
  console.log(`  skills copied → .agents/skills/`);
}

// Replace placeholders in all text files.
const TEXT_EXT = new Set([
  '.md', '.mdoc', '.mdx', '.json', '.ts', '.tsx', '.js', '.mjs', '.cjs',
  '.astro', '.css', '.html', '.yml', '.yaml', '.txt', '.svg', '.example',
]);
let replaced = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      walk(p);
    } else if (TEXT_EXT.has(path.extname(entry.name)) || entry.name === '.gitignore') {
      const src = fs.readFileSync(p, 'utf8');
      const out = src.replaceAll('__SITE_NAME__', args.name).replaceAll('__SITE_DOMAIN__', args.domain);
      if (out !== src) {
        fs.writeFileSync(p, out);
        replaced++;
      }
    }
  }
}
walk(targetDir);
console.log(`  placeholders replaced in ${replaced} files`);

if (args.git) {
  execSync('git init -b main', { cwd: targetDir, stdio: 'pipe' });
  execSync('git add -A', { cwd: targetDir, stdio: 'pipe' });
  execSync(`git commit -m "chore: scaffold ${args.name} from site-bootstrap (${args.template})"`, {
    cwd: targetDir,
    stdio: 'pipe',
  });
  console.log('  git repository initialized with initial commit');
}

console.log(`
Done. Next steps:
  cd ${path.relative(process.cwd(), targetDir) || '.'}
  npm ci
  npm run verify
  npm run dev        # site: http://localhost:4321, CMS: http://localhost:4321/keystatic
`);

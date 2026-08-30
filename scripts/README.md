# Scripts

## create-site.mjs

The only supported way to scaffold a new site.

```bash
node scripts/create-site.mjs --name my-site --domain example.com --target ../my-site
```

What it does:

1. Copies `templates/<template>/` (default `base-astro`) to the target directory. An existing target is accepted only when its entries are limited to the protected runtime paths `.pi` and `nul`; those entries are preserved untouched. Any other pre-existing entry is rejected before copying.
2. Renames `_gitignore` → `.gitignore`.
3. Copies `skills/` → `<target>/.agents/skills/` (skip with `--no-skills`).
4. Replaces `__SITE_NAME__` / `__SITE_DOMAIN__` placeholders in all text files.
5. Runs `git init` + initial commit (skip with `--no-git`).

The scaffold intentionally does **not** copy the bootstrap repository's `qmd.json`,
`qmd/collections/`, `.qmd/` runtime databases, or `kb/` knowledge base. Generated
sites therefore do not inherit this workspace's QMD registry, index, or KB content.
If a generated site needs its own knowledge base, it must adopt an independent,
repository-owned QMD configuration explicitly. The scope check is executable with
`python scripts/test_scaffold_scope.py`.

Requires Node.js 18+. Zero npm dependencies.

## check-skills.mjs

Compare the factory `skills/` tree with a generated site's `.agents/skills/`
snapshot without changing either tree:

```bash
node scripts/check-skills.mjs --target ../my-site/.agents/skills
```

The command reports each compared skill and SHA-256 fingerprint. It exits `0`
when snapshots match and `1` when unapproved files are missing, added, or
changed. Document intentional local divergence in a JSON file and pass it with
`--exceptions`:

```json
{
  "version": 1,
  "intentional_drift": [
    { "skill": "example-skill", "reason": "Local policy adaptation" }
  ]
}
```

The check is read-only and never synchronizes or overwrites site files.

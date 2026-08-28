# Scripts

## create-site.mjs

The only supported way to scaffold a new site.

```bash
node scripts/create-site.mjs --name my-site --domain example.com --target ../my-site
```

What it does:

1. Copies `templates/<template>/` (default `base-astro`) to the target directory.
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

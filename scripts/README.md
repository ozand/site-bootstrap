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

Requires Node.js 18+. Zero npm dependencies.

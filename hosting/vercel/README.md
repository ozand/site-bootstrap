# Hosting: Vercel

## Switch the adapter

The template ships with `@astrojs/node`. For Vercel:

```bash
npx astro add vercel
```

This installs `@astrojs/vercel` and replaces the adapter in `astro.config.mjs`:

```js
import vercel from '@astrojs/vercel';
// ...
adapter: vercel(),
```

Remove `@astrojs/node` from `package.json` afterwards.

## Deploy

```bash
npm i -g vercel
vercel link
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard — every push to `main` deploys.

## Keystatic on Vercel

`local` storage mode does NOT work on serverless hosting (read-only filesystem).
Switch `keystatic.config.ts` to GitHub mode:

```ts
storage: { kind: 'github', repo: { owner: '<owner>', name: '<repo>' } }
```

Then create a Keystatic GitHub App (the Keystatic CLI walks you through it on
first `/keystatic` visit) and add the env vars to Vercel:

```bash
vercel env add KEYSTATIC_GITHUB_CLIENT_ID
vercel env add KEYSTATIC_GITHUB_CLIENT_SECRET
vercel env add KEYSTATIC_SECRET
vercel env add PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
```

CMS edits then arrive as commits to the GitHub repo, triggering redeploys.

## vercel.json

`vercel.json` in this folder is a minimal starting point — copy it to the site
root if you need custom headers/redirects.

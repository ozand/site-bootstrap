# Hosting: VPS (Docker + Nginx)

The template's default adapter (`@astrojs/node`, standalone) is made for this —
no config changes needed.

## Option A: Docker (recommended)

The generated site includes a committed npm lockfile. Copy `Dockerfile` and
`docker-compose.yml` from this folder into the site root, then build with the
same strict lockfile contract used by CI and local verification:

```bash
docker compose up -d --build
```

The Dockerfile uses `npm ci`, which requires `package-lock.json` and fails on
manifest/lockfile drift. Keep `package.json` and `package-lock.json` together;
regenerate both with npm when dependencies change. The image build runs
`npm run build` after the locked install.

The site listens on `127.0.0.1:4321`; put Nginx (or Caddy/Traefik) in front for
TLS — see `nginx.conf`.

## Option B: bare Node + systemd

```bash
npm ci && npm run build
node dist/server/entry.mjs        # serves on HOST:PORT (default 0.0.0.0:4321)
```

Systemd unit example: `site.service` in this folder.

## Keystatic on a VPS

`local` storage mode works on a VPS (the filesystem is writable), but edits land
in the deployed working tree — you must push them back to the git remote or they
die with the container. Two sane setups:

1. **GitHub mode (recommended):** same as serverless — `storage: { kind: 'github' }`,
   env vars from `.env.example`. Edits become commits; redeploy via webhook/CI.
2. **Local mode + git sync:** mount the repo as a volume and run a cron/hook that
   commits and pushes `src/content/` changes. Simple, but review discipline is on you.

## TLS

Use certbot (`nginx.conf` assumes certs at `/etc/letsencrypt/live/<domain>/`) or
put the site behind Cloudflare.

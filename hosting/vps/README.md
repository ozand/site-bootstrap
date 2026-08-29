# Hosting: VPS (static release + Nginx)

The target architecture serves only versioned static releases from the public
VPS. Nginx points at the active `current` release directory; the public host does
not run Node, SSR, Keystatic, or a database for this site.

The repository's current Node/Docker files are retained as historical baseline
and implementation references for follow-up issues. They must not be treated as
the target public deployment contract; see
[the separated static-site architecture](../../docs/architecture/separated-static-site.md).

## Historical Node/Docker baseline (not public target)

The generated site includes a committed npm lockfile. If a private editor/build
fixture or a follow-up compatibility test needs the current baseline, copy
`Dockerfile` and `docker-compose.yml` from this folder into the site root, then
build with the strict lockfile contract used by CI and local verification:

```bash
docker compose up -d --build
```

The Dockerfile uses `npm ci`, which requires `package-lock.json` and fails on
manifest/lockfile drift. Keep `package.json` and `package-lock.json` together;
regenerate both with npm when dependencies change. The image build runs
`npm run build` after the locked install.

This historical baseline listens on `127.0.0.1:4321`; it is not a public
Node deployment. The target static publication uses Nginx directly against the
versioned release directory. TLS and any private editor-host access policy are
separate deployment decisions.

## Static public release contract

The public VPS receives a verified artifact from the separate build host. Store
releases under `releases/<release-id>/`, retain the last accepted release, and
atomically point `current` at the selected release. Nginx serves that directory
only. Promotion and rollback belong to the follow-up deployment issues; retain
checksums and sanitized health results.

The following Node/systemd and Keystatic notes are historical compatibility
references only and are not the target public deployment:

- `site.service` and `node dist/server/entry.mjs` belong to the old SSR baseline;
- Keystatic GitHub-mode belongs on the private editor host, not the public VPS;
- the public VPS has no Node/SSR, Keystatic, source checkout, or database.
## TLS

Use certbot (`nginx.conf` assumes certs at `/etc/letsencrypt/live/<domain>/`) or
put the site behind Cloudflare.

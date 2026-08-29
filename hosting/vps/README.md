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

Use [`nginx-static.conf`](./nginx-static.conf) for the public static profile. It
serves the immutable `current` release with `try_files`, disables directory
listing, returns `404` for both `/keystatic` and `/keystatic/` descendants, and
contains no Node upstream or `proxy_pass`. Validate the profile with:

```bash
node hosting/vps/test-nginx-static.mjs
```

If Nginx is installed, the helper also runs `nginx -t` against a temporary
synthetic release/config. Otherwise it runs deterministic config assertions.
The public VPS receives a verified artifact from the separate build host. Store
releases under `releases/<release-id>/`, retain the last accepted release, and
atomically point `current` at the selected release. Nginx serves that directory
only. Promotion and rollback belong to the follow-up deployment issues; retain
checksums and sanitized health results.

### Disposable publisher

`publish-static-release.mjs` publishes a verified static artifact into a
versioned release tree. It rejects empty or incomplete artifacts, symlinks,
unsafe release identifiers, duplicate release IDs, and digest changes during
staging. It copies into a hidden staging directory, verifies the copied digest,
renames the directory into place, then atomically replaces the `current`
symlink. A failed publish removes its staging directory and leaves the existing
`current` pointer unchanged.

Usage (disposable or explicitly authorized target only):

```bash
node hosting/vps/publish-static-release.mjs \
  --artifact ./artifact/dist \
  --root /srv/example-release-root \
  --release <source-revision-or-release-id> \
  --retain 2
```

The artifact must be outside the release root. The required `index.html` entry
is checked, all files are hashed with a deterministic path/length/content
framing, and the status JSON reports only release ID, file count, digest, current
pointer, and removed release IDs. Nginx configuration and production rollout are
out of scope. Verify the contract with:

```bash
node hosting/vps/test-publish-static-release.mjs
```


### Disposable rollback verification

Run the tracked synthetic rollback test:

```bash
node hosting/vps/test-static-rollback.mjs
```

It publishes two distinguishable releases, checks the actual temporary static
serving boundary, verifies that an empty failed publication leaves `current`
unchanged, atomically switches `current` back to the retained known-good release,
and checks the restored HTTP response. It uses no public host or production state.

The following Node/systemd and Keystatic notes are historical compatibility
references only and are not the target public deployment:

- `site.service` and `node dist/server/entry.mjs` belong to the old SSR baseline;
- Keystatic GitHub-mode belongs on the private editor host, not the public VPS;
- the public VPS has no Node/SSR, Keystatic, source checkout, or database.
## TLS

Use certbot (`nginx.conf` assumes certs at `/etc/letsencrypt/live/<domain>/`) or
put the site behind Cloudflare.

# Private Keystatic editor host

This is the deployment contract for the editor profile, not an authentication
or production-rollout proof. Issue #21 remains the separate application
authentication/authorization matrix. The contract is intentionally separate
from the public static Nginx boundary.

## Topology

```text
GitHub repository (source/content)
          ^
          | GitHub-mode Keystatic commits
private editor host -- private network/Tailscale --> authorized operator
          |
          | build input only; never public serving
separate build host --> public static dist/ --> versioned VPS release/current --> Nginx
```

The editor host runs the generated site's `astro.config.editor.mjs` profile and
is separate from the public static profile. The public profile omits the
Keystatic integration and emits only static `dist/` files. The public VPS must
not run Node/SSR, Keystatic, or a database for this site.

## Configuration contract

1. Check out the intended GitHub revision on the private editor host.
2. Use the explicit editor commands:

   ```bash
   npm ci
   npm run dev:editor
   # or: npm run build:editor
   ```

3. Change `keystatic.config.ts` from development local storage to the GitHub
   storage block for the intended repository:

   ```ts
   storage: { kind: 'github', repo: { owner: '<owner>', name: '<repo>' } }
   ```

4. Provide the required `KEYSTATIC_*` values through the private host
   environment or secret store. The committed `.env.example` contains names
   and empty placeholders only. Never commit real values, copy them into the
   build context, or place them in `dist/`.
5. Restrict the editor host at the intended enforcement point: private
   network/Tailscale and, where applicable, a proxy ACL. Record allowed
   principal classes and the protected editor route in the deployment receipt.

## Verification contract

The following checks are safe without real OAuth credentials:

```bash
npm ci
npm run verify
npm run build             # public static profile
npm run build:editor      # private editor profile
```

Inspect the outputs:

- public build: static `dist/index.html` and representative pages; no
  `dist/server/`, Node entrypoint, or Keystatic route bundle;
- editor build: server entry and Keystatic route bundle are present;
- `.env.example` has placeholders only;
- no credentials, cookies, tokens, private payloads, or session state are in
  source, artifact, or logs.

These checks prove configuration/build separation only. They do not prove
GitHub OAuth, session validity, application authorization, Tailscale ACL
correctness, or GitHub write behavior. Those require an explicitly authorized
non-production identity and belong to #21 or a separately scoped rollout test.

## Safe deployment boundary

The editor host is private and is not a public release target. Do not point the
public Nginx root at the editor build, do not copy the editor artifact into the
public static release, and do not reuse public VPS services for editor tests.
A host or provider test must use a disposable target or an explicitly authorized
private environment. Stop if ownership, identity, network enforcement, or secret
handling is ambiguous.

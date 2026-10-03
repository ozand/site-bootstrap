# Astro 7 factory migration — Issue #81

## Scope and decision

ADR-006 records the owner-authorized upgrade to registry-verified stable Astro 7.3.5. Baseline is `1dd7900bb79b4828b2f70f9a42064ce57ed810a5`. The repository is a factory; AYGA is a test site, not an operational downstream rollout target.

Implementation and tests used standalone copies on C: with explicit directory guards and absolute npm prefixes. No production, existing-site, editor authentication, or persistence changes were performed.

## Minimal compatibility changes

- Astro 7.3.5, Node adapter 11.1.6, Markdoc 2.0.9 and Keystatic Astro 6.0.0 satisfy the new integration peer requirements.
- The deprecated Astro Tailwind integration declares peers only through Astro 5. Replace it with instantiated Tailwind 3 and Autoprefixer PostCSS plugins in both profiles. This composition is an experimentally verified compatibility path, not an official Astro Tailwind 3 migration recipe.
- Retain Tailwind 3, CSS variables, local Inter, layout, components, content paths and both CMS/content schemas. Correct obsolete Astro 5 copy.
- Declare Astro's Node >=22.12 and npm >=9.6.5 requirements. Tests used Node 24.14.0/npm 11.19.0; the minimum runtime was not tested.

## Observed verification

Fresh supported scaffold `astro81-delivery`: npm install, npm ci, verify, static public build and Node editor build all completed successfully. Generated manifest equals template after name substitution; parsed lockfile contents match with no node/version drift (byte formatting differs).

Verify: 0 errors, 0 warnings, 9 deprecation hints. Builds report Vite esbuild/Rolldown deprecations, a Markdoc head-inject directive warning, and editor SSR/chunk warnings. Successful builds are not proof of editor authentication.

Public output was preserved before editor build: 11 payload files, four HTML routes, local font/license, CSS/client JS, favicon and sitemaps. Independent reviewer checked every payload hash and no editor/server paths.

Final browser comparison: four routes at 360/390/1280 in light and forced-dark themes, baseline and delivery. All 48 navigations returned 200; no external requests or horizontal overflow. Heading Inter usage, theme tokens, navigation/card links and keyboard focus behavior matched. Astro version copy intentionally changed. No WCAG or glyph-coverage certification is claimed.

## Audit and limitations

Same-session baseline audit: 15 package records (3 low, 11 high, 1 critical). Delivery audit: 13 high package records, no critical in that snapshot. New inherited Keystatic record and substantial migration graph churn prevent interpreting counts alone as security improvement. No audit fix, force, overrides or unrelated advisory remediation was used.

Previous writer isolation incidents remain separate: two accidental tracked config edits were backed up and precisely restored; prior possible deletion of untracked root files remains unresolved. Successful migration tests do not establish recovery.

## Delivery status

Development and local tests complete; independent source/evidence review and PR integration pending. Rollout target is the canonical template only. Raw screenshots and logs remain local; portable hash evidence accompanies this report. Residual audit findings and build warnings remain disclosed.

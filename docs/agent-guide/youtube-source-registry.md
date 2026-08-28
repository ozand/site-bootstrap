# YouTube source registry

A compact, reviewable registry for selecting YouTube material for research. This
registry records source decisions and provenance; it does not promote transcript
claims to verified facts.

## States

- `approved`: suitable for bounded research context under the stated scope.
- `rejected`: excluded from the current research corpus for the stated reason. A
  rejected entry is never approved automatically; it requires a new review decision.
- `not-promoted`: the source may be retained as context, but its claims must not be
  promoted to canonical guidance or verified facts.

## Entry contract

Each entry must include `video_id`, canonical token-free `url`, title, channel,
published date, review date, transcript kind/language, decision state, claim handling,
rationale, reviewer, and scope/limitations. Use `reported` for claims from a video
unless a separate primary source or reproducible test supports a stronger status;
`not-promoted` is the default claim handling for tutorial/demo material.

## Current registry

| ID | Canonical URL | Video / channel | Published | Reviewed | Transcript | State | Claim handling | Scope and rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `6l2YWCyPsWk` | [watch](https://www.youtube.com/watch?v=6l2YWCyPsWk) | *Keystatic with Astro's Content Collections* — simonswiss | 2023-03-30 | 2026-08-28 | auto-generated, en | approved | not-promoted | Concrete Astro/Keystatic collections, Markdoc, branch/PR and deployment walkthrough; historical tutorial, not current API certification. |
| `FmzbkWV-SwU` | [watch](https://www.youtube.com/watch?v=FmzbkWV-SwU) | *How to Deploy Astro on Cloudflare in Minutes* — Tech on Wheels | 2026-01-25 | 2026-08-28 | auto-generated, en | approved | not-promoted | Concrete Pages/Workers deployment distinction and adapter steps; Cloudflare-specific tutorial, not provider-neutral baseline. |
| `FjHtZnjNEBU` | [watch](https://www.youtube.com/watch?v=FjHtZnjNEBU) | *Claude Code + GitHub WORKFLOW for Complex Apps* — Greg Baugues | 2025-06-26 | 2026-08-28 | auto-generated, en | approved | not-promoted | Bounded issue→plan→test→PR/review workflow; process evidence, not Astro-specific behavior. |
| `VsZ6feIU_bA` | [watch](https://www.youtube.com/watch?v=VsZ6feIU_bA) | *How to Optimize Images in Astro* — Coding in Public | 2023-06-13 | 2026-08-28 | auto-generated, en | approved | not-promoted | Concrete image HTML/network demonstration; Astro 2.6-era API and presenter samples require current-version verification. |
| `fPifaHiKzz4` | [watch](https://www.youtube.com/watch?v=fPifaHiKzz4) | *Astro Blog Course #16 - SEO basics* — Coding in Public | 2023-01-10 | 2026-08-28 | auto-generated, en | approved | not-promoted | Concrete canonical/OG/JSON-LD/robots implementation walkthrough; educational, no ranking evidence. |
| `e-hTm5VmofI` | [watch](https://www.youtube.com/watch?v=e-hTm5VmofI) | *Astro Web Framework Crash Course* — freeCodeCamp.org | 2023-09-29 | 2026-08-28 | auto-generated, en-US | approved | not-promoted | Historical SSG/SSR and route/content walkthrough; background only, no current compatibility proof. |
| `dODMd6iAet8` | [watch](https://www.youtube.com/watch?v=dODMd6iAet8) | *Google & IKEA Use This Framework! (Claude Code + Astro)* — Alex Followell \| AI Automation | 2026-02-05 | 2026-08-28 | auto-generated, en | approved | not-promoted | Agent-created Astro site, GitHub push/security review and Vercel deployment walkthrough; demo/marketing claims excluded. |
| `uxFAJZvtMVA` | [watch](https://www.youtube.com/watch?v=uxFAJZvtMVA) | *How I Built My New Site Using Astro and Claude Code* — Tony Alicea | 2025-11-25 | 2026-08-28 | auto-generated, en-US | approved | not-promoted | Context/spec/plan/CLAUDE.md workflow demonstration; process evidence only. |
| `ELkPcuO5ebo` | [watch](https://www.youtube.com/watch?v=ELkPcuO5ebo) | *Dokploy is my absolute favorite way to deploy to a VPS in 2025* — Dreams of Code | 2025-07-20 | 2026-08-28 | auto-generated, en-US | approved | not-promoted | VPS Git/Docker/review-app workflow; provider-specific tutorial, not a production guarantee. |
| `uEVmD6n8Il0` | [watch](https://www.youtube.com/watch?v=uEVmD6n8Il0) | *7 Ways to Deploy a Node.js App* — Fireship | 2021-07-26 | 2026-08-28 | auto-generated, en-US | approved | not-promoted | Generic Node deployment trade-offs; historical background, Node 14/16 examples not baseline versions. |
| `G9bFDv2JuuY` | [watch](https://www.youtube.com/watch?v=G9bFDv2JuuY) | *Debugging SvelteKit adaptor-node build output* — Nikos Tech Downtime | 2021-04-22 | 2026-08-28 | auto-generated, en | rejected | not-promoted | SvelteKit rather than Astro; retained only as non-Astro analogy and excluded from Astro claims. |
| `N3pywDv-0Tg` | [watch](https://www.youtube.com/watch?v=N3pywDv-0Tg) | *Keystatic in under 5 minutes* — simonswiss | 2023-06-26 | 2026-08-28 | no usable subtitles found | rejected | not-promoted | Metadata exists, but no bounded transcript evidence was available in the selected extraction. |

## Review rules

1. Use the canonical YouTube URL without tracking parameters.
2. Record the exact video ID, channel, publication date, capture date, subtitle
   language/kind, and timestamp locators in the raw capture.
3. Keep `reported` status for tutorial/demo claims; cross-check current APIs and
   reproduce important behavior before canonicalizing.
4. Re-review entries when the relevant Astro/Keystatic/provider major version changes.
5. Never store media, cookies, tokens, private URLs, or full transcripts when a
   bounded note is sufficient.

## Review metadata

- Reviewed: 2026-08-28
- Reviewer: site-bootstrap maintainer
- Source basis: existing B1–B10/B7/B9 research reports and their recorded yt-dlp
  metadata/transcript locators; no new browsing or claims created for this registry.
- This registry is a source-selection aid, not a truth or quality guarantee.

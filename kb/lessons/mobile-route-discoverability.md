# Mobile layouts can hide routes despite passing route and build checks

**Date:** 2026-09-23 · **Area:** accessibility / navigation

## Symptom

All expected routes return HTTP 200 and the primary call-to-action remains visible at narrow viewport widths, but visitors cannot discover some approved top-level routes from every mobile page because the desktop navigation is hidden and no equivalent visible route links are provided.

## Cause

Route existence and CTA visibility were used as proxies for route discoverability. In the reviewed case, the desktop navigation was hidden at mobile widths; earlier route inventory included those hidden links and therefore overstated what a mobile visitor could reach. The verified deficit was the absence of visible paths among approved routes on some pages, not a build or routing failure.

## Fix

A separately approved, narrowly scoped correction displayed the existing top-level navigation links as a persistent second row in the mobile header, retaining the existing brand and primary CTA. The change used existing routes and links and did not add a menu interaction or alter the public route set.

## Evidence

- [Evaluation correction, issue #15](https://github.com/ozand/site-ayga/issues/15#issuecomment-5769925593) reports the mobile discoverability deficit and distinguishes visible CTA reachability from access to all approved routes.
- [Implementation completion, issue #32](https://github.com/ozand/site-ayga/issues/32#issuecomment-5784903549) reports the scoped correction and local verification. These are source-recorded results; this lesson does not independently reproduce the consumer tests or include screenshots.

## Verification

The #15 record reports browser inspection of six routes at 360px and 390px, including CTA hit-test/focus and hidden navigation. The #32 completion record reports `npm run verify`, `npm run build`, and local Chromium checks at 360px and 390px: visible top-level navigation, preserved brand and CTA destinations, keyboard focus, successful local route responses, and no horizontal overflow. These are reported local results, not an independently reproduced factory test. They do not establish production behavior, physical-device behavior, assistive-technology behavior, or improved conversion.

## Prevention

At each supported narrow viewport, inspect the rendered and visible navigation—not only DOM/link inventories or successful route responses. Verify that visitors can reach each required top-level route, that the primary action remains usable, that keyboard focus is visible, and that the layout does not overflow. Record hidden links as unavailable for visual discovery unless an operable disclosure is explicitly tested.

## Applicability

Use this lesson when evaluating responsive route discoverability in sites with collapsible or hidden navigation. It does not prescribe a universal mobile-menu design: choose a minimal pattern appropriate to the site's routes and interaction needs. Build success, HTTP 200 responses, and visible primary CTA do not alone prove that routes are discoverable. Deployment equivalence, migration portability, production behavior, and assistive-technology behavior were not verified by the source evidence for this lesson.

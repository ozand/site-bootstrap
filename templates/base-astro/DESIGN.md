---
version: alpha
name: __SITE_NAME__
description: "Implemented starter design tokens for __SITE_NAME__"
omitted:
  - section: spacing
    reason: "Spacing uses Tailwind utility classes; no named scale is implemented."
colors:
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  primary-foreground: "#FFFFFF"
  primary-dark: "#60A5FA"
  primary-dark-hover: "#93C5FD"
  primary-dark-foreground: "#0A0A0A"
  background-light: "hsl(0 0% 100%)"
  foreground-light: "hsl(0 0% 3.9%)"
  card-light: "hsl(0 0% 100%)"
  card-foreground-light: "hsl(0 0% 3.9%)"
  secondary-light: "hsl(0 0% 96.1%)"
  secondary-foreground-light: "hsl(0 0% 9%)"
  muted-light: "hsl(0 0% 96.1%)"
  muted-foreground-light: "hsl(0 0% 45.1%)"
  accent-light: "hsl(0 0% 96.1%)"
  accent-foreground-light: "hsl(0 0% 9%)"
  border-light: "hsl(0 0% 89.8%)"
  input-light: "hsl(0 0% 89.8%)"
  destructive-light: "hsl(0 84.2% 60.2%)"
  destructive-foreground-light: "hsl(0 0% 98%)"
  background-dark: "hsl(0 0% 3.9%)"
  foreground-dark: "hsl(0 0% 98%)"
  card-dark: "hsl(0 0% 3.9%)"
  card-foreground-dark: "hsl(0 0% 98%)"
  secondary-dark: "hsl(0 0% 14.9%)"
  secondary-foreground-dark: "hsl(0 0% 98%)"
  muted-dark: "hsl(0 0% 14.9%)"
  muted-foreground-dark: "hsl(0 0% 63.9%)"
  accent-dark: "hsl(0 0% 14.9%)"
  accent-foreground-dark: "hsl(0 0% 98%)"
  border-dark: "hsl(0 0% 14.9%)"
  input-dark: "hsl(0 0% 14.9%)"
  destructive-dark: "hsl(0 62.8% 30.6%)"
  destructive-foreground-dark: "hsl(0 0% 98%)"
  focus-light: "#2563EB"
  focus-dark: "#93C5FD"
rounded:
  sm: 4px
  md: 6px
  lg: 8px
typography:
  sans:
    fontFamily: Inter
---

## Overview

This design brief documents the values implemented by the starter template; it
is not a promise that each token appears on every route or component. Light and
dark theme variables are defined in `src/styles/globals.css`, then mapped to
Tailwind utilities in `tailwind.config.ts`.

## Colors

The light and `.dark` class theme maps below match the CSS custom properties in
the starter. Blue is used by the primary Button default and link variants;
ordinary navigation and content anchors retain their inherited neutral
foreground unless a use site selects the primary link variant. Neutral body text,
surfaces, borders, and destructive colors retain separate roles.

- **Primary Button default and link variants:** light `#2563EB`; foreground on
  the filled default variant `#FFFFFF`; solid default-button hover `#1D4ED8`.
- **Dark primary Button variants:** `#60A5FA`; foreground on the filled default
  variant `#0A0A0A`; solid default-button hover `#93C5FD`.
- **Button keyboard focus ring:** light `#2563EB`; dark `#93C5FD`. The Button
  applies a 2px ring with a 2px offset in the current background color. Other
  anchors retain their existing focus behavior unless their use site defines one.
- **Light background/card:** `hsl(0 0% 100%)`; **dark background/card:**
  `hsl(0 0% 3.9%)`.
- **Secondary and accent surfaces:** light `hsl(0 0% 96.1%)` with foreground
  `hsl(0 0% 9%)`; dark `hsl(0 0% 14.9%)` with foreground
  `hsl(0 0% 98%)`.
- **Muted surface:** light `hsl(0 0% 96.1%)` with muted foreground
  `hsl(0 0% 45.1%)`; dark `hsl(0 0% 14.9%)` with muted foreground
  `hsl(0 0% 63.9%)`.
- **Body foreground:** light `hsl(0 0% 3.9%)`; dark `hsl(0 0% 98%)`.
  Muted foreground is independently defined per theme.
- **Border/input:** light `hsl(0 0% 89.8%)`; dark `hsl(0 0% 14.9%)`.
- **Destructive:** light `hsl(0 84.2% 60.2%)`; dark `hsl(0 62.8% 30.6%)`; both
  use `hsl(0 0% 98%)` foreground.

These mappings do not claim WCAG conformance. Evaluate actual rendered foreground,
background, hover, disabled, and focus states when changing UI.

## Typography

The Tailwind sans font family is Inter. CSS serves Inter v4.1 from a local
variable WOFF2 with `font-display: swap`; `ui-sans-serif`, `system-ui`, and
`sans-serif` are the CSS fallback stack. Serif and monospace utilities remain
separate. Sizes, weights, line heights, and tracking come from utilities at
individual use sites; there is no global heading/body type-size scale.

## Layout

Spacing follows the existing Tailwind utility scale at each use site; the starter
has no named global spacing-token scale. The centered `container` utility uses
`2rem` horizontal padding and a `1400px` maximum-width breakpoint at `2xl`.

## Shapes

The root radius is `0.5rem` (8px at the default 16px root size). Tailwind derives
`rounded-sm` as `calc(var(--radius) - 4px)` (4px), `rounded-md` as
`calc(var(--radius) - 2px)` (6px), and `rounded-lg` as `var(--radius)` (8px).
Components select among these utilities at their usage sites; there is no
universal card or button radius assignment.

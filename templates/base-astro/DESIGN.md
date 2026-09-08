---
version: alpha
name: __SITE_NAME__
description: "Design system tokens for __SITE_NAME__"
colors:
  primary: "#1A1A2E"
  secondary: "#6B7280"
  tertiary: "#2563EB"
  neutral: "#F9FAFB"
typography:
  h1:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 1.875rem
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  lg: 16px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.lg}"
---

## Overview

A clean, modern design system with neutral foundations and a single accent
color. The visual tone is professional and content-focused — typography-led
layouts with generous whitespace.

Customize these tokens to match the specific brand identity of the site.
The starter values are deliberately neutral so they work as a baseline for
any project scaffolded from site-bootstrap.

## Colors

The palette uses high-contrast neutrals with one functional accent:

- **Primary (#1A1A2E):** Deep near-black for headlines and core text.
- **Secondary (#6B7280):** Muted gray for supporting text, borders, and metadata.
- **Tertiary (#2563EB):** Blue accent for interactive elements (links, buttons, focus rings). Chosen to meet WCAG AA contrast against white text (5.17:1).
- **Neutral (#F9FAFB):** Light off-white background, used as the default card background.

## Typography

All type is set in Inter, a widely available sans-serif optimized for screen
readability. The scale uses four levels:

- **h1:** Large headings (2.5rem, tight tracking).
- **h2:** Section headings (1.875rem).
- **body-md:** Body text (1rem, relaxed line-height for readability).
- **label-sm:** Labels and metadata (0.875rem, medium weight).

Replace `Inter` with the project's chosen typeface when brand fonts are decided.

## Layout

Spacing follows a base-8 scale: 8 / 16 / 32 / 64 px. Use `sm` for tight
internal gaps, `md` for standard padding, `lg` for section spacing, and `xl`
for major page sections.

## Shapes

Corner radii range from `sm` (4px, subtle) to `lg` (16px, pronounced).
Cards default to `lg`; buttons and inputs use `md`.

Component rounding is declared via the `rounded` sub-token (e.g.
`rounded: "{rounded.md}"`), which references the scale above.

---
name: web-accessibility
description: Apply web accessibility standards and remediation practices.
license: MIT
compatibility: opencode
metadata:
  audience: frontend
  workflow: accessibility
---

# Web Accessibility Skill

## 1. Quick Use
- **When to use:** accessibility compliance checks and remediation for keyboard/screen-reader flows.
- **How to invoke:** `skill({ name: "web-accessibility" })`.
- **Execution pattern:** evaluate against WCAG principles, apply fixes, retest assistive scenarios.
- **Definition of done:** key a11y issues are resolved and accessibility checks pass.

## 2. Overview
Comprehensive guide to WCAG 2.1 compliance and inclusive design. Use this skill to ensure the application is usable by people with disabilities (screen readers, keyboard users, cognitive impairments).

## 3. Core Principles (POUR)
1.  **Perceivable:** Information must be presentable to users (text alts, captions).
2.  **Operable:** UI components must be navigable (keyboard, timing).
3.  **Understandable:** UI must be readable and predictable.
4.  **Robust:** Compatible with assistive technologies.

## 4. Implementation Guide

### 4.1. Semantic HTML
- Use native elements (`<button>`, `<a>`, `<input>`) over `<div>` whenever possible.
- Use `<header>`, `<main>`, `<footer>`, `<nav>`, `<aside>` for landmarks.
- **Headings:** Strict `h1` -> `h6` hierarchy. No skipping levels.

### 4.2. Forms & Interactive Elements
- **Labels:** Every input MUST have a label (visible or `aria-label`).
- **Focus:** Visible focus ring (`ring-offset`, `ring` in Tailwind) for keyboard users.
- **State:** Use `aria-expanded`, `aria-pressed`, `aria-disabled` to communicate state.
- **Errors:** Link error messages to inputs via `aria-describedby`.

### 4.3. Visuals & Colors
- **Contrast:** Text/Background ratio > 4.5:1 (AA standard).
- **Images:** meaningful `alt` text for info images, `alt=""` for decorative.
- **Animation:** Respect `prefers-reduced-motion`.

### 4.4. ARIA (Advanced)
- **Rule 1:** Don't use ARIA if HTML5 works.
- **Modals:** Trap focus inside modal. `role="dialog"`.
- **Tabs:** `role="tablist"`, `tab`, `tabpanel`.
- **Status:** Use `role="status"` or `aria-live="polite"` for dynamic updates (toasts).

## 5. Checklist
- [ ] Can navigate entire page with only TAB key?
- [ ] Focus indicators are clearly visible?
- [ ] All images have `alt` attributes?
- [ ] Heading structure is logical (H1 -> H2)?
- [ ] Form inputs have associated labels?
- [ ] Color contrast passes WCAG AA?

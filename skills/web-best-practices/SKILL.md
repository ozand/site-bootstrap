---
name: web-best-practices
description: Enforce modern web best practices for security, maintainability, and quality.
license: MIT
compatibility: opencode
metadata:
  audience: engineering
  workflow: quality-standards
---

# Web Best Practices and Security Skill

## 1. Quick Use
- **When to use:** enforcing secure, maintainable, and modern web engineering standards.
- **How to invoke:** `skill({ name: "web-best-practices" })`.
- **Execution pattern:** apply best-practice checklist, fix gaps, and verify quality baselines.
- **Definition of done:** implementation aligns with current web quality and security expectations.

## 2. Overview
A collection of modern web development standards, security hardening, and code quality practices.

## 3. Security
- **HTTPS:** Enforce SSL everywhere.
- **Headers:**
    - `Content-Security-Policy` (CSP): Restrict sources of scripts/styles.
    - `X-Content-Type-Options: nosniff`.
    - `X-Frame-Options: DENY` (prevent clickjacking).
- **Links:** `rel="noopener noreferrer"` for `target="_blank"`.
- **Sanitization:** Never render raw HTML without sanitization (use `sanitize-html` or Astro's strict escaping).

## 4. Modern APIs
- **Fetch:** Use `fetch` over `XMLHttpRequest`.
- **Async/Await:** Avoid callback hell.
- **IntersectionObserver:** For lazy loading and scroll effects.
- **ResizeObserver:** For responsive components.

## 5. Code Quality
- **TypeScript:** Strict mode enabled. No `any`.
- **Error Handling:**
    - Try/Catch blocks for async operations.
    - Global Error Boundaries (React).
    - 404/500 UI pages.
- **Console:** No `console.log` in production code.

## 6. Checklist
- [ ] No console errors in DevTools.
- [ ] External links have `rel="noopener noreferrer"`.
- [ ] Secrets (API Keys) are in `.env`, not code.
- [ ] `npm audit` shows no critical vulnerabilities.
- [ ] Images have correct aspect ratios.

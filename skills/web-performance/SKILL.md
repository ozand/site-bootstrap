---
name: web-performance
description: Optimize Core Web Vitals and runtime performance across web pages.
license: MIT
compatibility: opencode
metadata:
  audience: frontend
  workflow: performance-optimization
---

# Web Performance Optimization Skill

## 1. Quick Use
- **When to use:** improving Core Web Vitals, bundle weight, and runtime responsiveness.
- **How to invoke:** `skill({ name: "web-performance" })`.
- **Execution pattern:** profile bottlenecks, apply targeted optimizations, and re-measure metrics.
- **Definition of done:** performance targets move toward thresholds with measured evidence.

## 2. Overview
Expert knowledge on optimizing web performance, focusing on Core Web Vitals (CWV) and runtime efficiency. Use this skill to diagnose slow loading, improve interactivity, and ensure a smooth user experience.

## 3. Core Web Vitals (CWV) Targets
| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | **< 2.5s** | Load the main content quickly. |
| **INP** (Interaction to Next Paint) | **< 200ms** | Respond to user clicks instantly. |
| **CLS** (Cumulative Layout Shift) | **< 0.1** | Visual stability (no jumping). |

## 4. Performance Budgets & Targets
### 4.1. Lighthouse Scores
| Category | Target |
|----------|--------|
| Performance | >= 90 |
| Accessibility | 100 |
| Best Practices | >= 95 |
| SEO | >= 95 |

### 4.2. Resource Budgets
| Resource | Limit (Compressed) |
|----------|-------------------|
| **JavaScript** | < 300 KB |
| **CSS** | < 100 KB |
| **Images** | < 500 KB (above fold) |
| **Fonts** | < 100 KB |
| **Total Page** | < 1.5 MB |

## 5. Optimization Strategies

### 5.1. LCP (Loading Speed)
- **Image Optimization:**
    - Use `format="webp"` or `avif`.
    - Explicit `width` and `height` to prevent layout shifts.
    - `loading="eager"` for the LCP element (hero image), `loading="lazy"` for everything else.
    - **Astro:** Use `<Image />` component.
- **Preloading:**
    - `<link rel="preload" as="image" href="...">` for Hero images.
    - Preconnect to external domains (fonts, APIs).
- **Server Side:**
    - Ensure fast Time to First Byte (TTFB).
    - Use SSR for critical content (Astro `output: server` or `hybrid`).

### 5.2. INP (Interactivity)
- **Main Thread:** Keep it free. Break up long tasks (>50ms).
- **React:**
    - Avoid unnecessary re-renders (use `memo`, `useCallback`).
    - Use `useTransition` for non-urgent updates.
    - **Hydration:** Use `client:visible` or `client:idle` in Astro to delay hydration of heavy components.
- **Event Handlers:** passive listeners for scroll/touch.

### 5.3. CLS (Visual Stability)
- **Dimensions:** Always set `width` and `height` on `<img>`, `<video>`, `<iframe>`.
- **Fonts:** Use `font-display: swap` or `optional` to avoid FOIT/FOUT re-layout.
- **Dynamic Content:** Reserve space (Skeleton loaders) for dynamic data using `min-height`.

### 5.4. Bundle Optimization
- **Code Splitting:** Dynamic imports `import(...)`.
- **Tree Shaking:** Ensure unused exports are removed.
- **Deps:** Audit `package.json` for heavy libraries (use `bundlephobia`).

## 6. Checklist
- [ ] Hero image is `eager` and `webp`.
- [ ] Fonts are self-hosted or preconnected.
- [ ] No layout shifts during loading (Skeletons used).
- [ ] Hydration is deferred for non-critical components.
- [ ] `console.log` and unused code removed.

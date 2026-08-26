---
name: asset-optimization
description: Optimize images and static assets for web performance and production readiness.
license: MIT
compatibility: opencode
metadata:
  audience: engineering
  workflow: asset-pipeline
---

# Asset Optimization Standard

## 1. Quick Use
- **When to use:** image and static asset optimization, especially before publishing.
- **How to invoke:** `skill({ name: "asset-optimization" })`.
- **Execution pattern:** follow the rules in this file, apply changes, then verify page performance.
- **Definition of done:** optimized assets are applied and validation evidence is documented.

**Version:** 1.0
**Context:** Web Performance & SEO

## 2. The Rule (Golden Standard)
**No unoptimized images in production.**
All images served on the blog or resource pages MUST be:
1.  **Format:** WebP (preferred) or AVIF.
2.  **Size:** < 500KB (aim for < 200KB for hero images).
3.  **Dimensions:** Max width 1600px for full-width heroes.

## 3. Tooling
We have a dedicated CLI utility for this: `scripts/optimize-image.ts`.

### 3.1. How to Use
```bash
npx tsx scripts/optimize-image.ts public/images/blog/my-image.jpg
```

**What it does:**
1.  Resizes image to max 1600px width.
2.  Converts to WebP (Quality 80).
3.  **Deletes the original file.**

## 4. Workflow
When processing a new blog post or resource:
1.  **Download/Create** the image in `public/images/blog/`.
2.  **Run Optimization:** Immediately run the optimization script on the file.
3.  **Update Frontmatter:** Ensure the `.mdx` file references the new `.webp` extension.
    ```yaml
    # Bad
    image: /images/blog/hero.jpg
    
    # Good
    image: /images/blog/hero.webp
    ```
4.  **Verify:** Check the file size is acceptable before committing.

## 5. Bulk Audit (Manual)
To find heavy images in the project:
```bash
find public/images -type f -size +500k
```
Any matches should be optimized immediately.

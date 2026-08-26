---
name: astro-troubleshooting
description: Diagnose and fix common Astro build, routing, SSR, and integration issues.
license: MIT
compatibility: opencode
metadata:
  audience: engineering
  workflow: troubleshooting
---

# Astro Development & Troubleshooting Skill

## 1. Quick Use
- **When to use:** Astro build, routing, SSR, hydration, or content-collection issues.
- **How to invoke:** `skill({ name: "astro-troubleshooting" })`.
- **Execution pattern:** map the issue to the relevant section, apply fix, run verification commands.
- **Definition of done:** root cause is resolved and confirmed by reproducible checks.

This skill captures specific lessons learned while developing with Astro, React, and server-side rendering in this project. Use this when debugging build errors, routing issues, or data fetching problems.

## 2. SSR vs. Static Generation

### 2.1. The Trap
In `output: 'server'` mode (SSR), Astro pages run on every request. `getStaticPaths` is **ignored** for dynamic routes unless `export const prerender = true` is set.

### 2.2. The Bug (Undefined Props)
If you migrate a page from SSG to SSR, `Astro.props` (populated by `getStaticPaths`) becomes `undefined`.
**Code that crashes in SSR:**
```typescript
const { post } = Astro.props; // undefined in SSR!
const { Content } = await post.render(); // Crash
```

### 2.3. The Fix
Always add a fallback to fetch data dynamically:
```typescript
const { slug } = Astro.params;
let post = Astro.props.post;

if (!post && slug) {
  post = await getEntry('posts', slug);
}

if (!post) return Astro.redirect('/404');
```

## 3. Content Collections & Slugs

### 3.1. The Trap
Astro's content collection loader automatically "slugifies" filenames. It often strips dots or special characters differently than expected.
- Filename: `2.5-72b.md`
- Generated Slug: `25-72b` (Dots removed)

### 3.2. The Fix
1.  **Never assume the slug.** Do not link to `/models/2.5-72b` just because the file is named that.
2.  **Use the API.** Check the `slug` property returned by `getCollection()`.
3.  **Debug Script:** Use `scripts/debug-slugs.ts` (or similar) to print the actual generated slugs if 404s occur.

## 4. Client-Side API Calls (CORS)

### 4.1. The Trap
Calling external LLM APIs (OpenAI, Anthropic, Chutes.ai) directly from a browser component (`client:only="react"`) usually fails due to CORS (Cross-Origin Resource Sharing) restrictions enforced by the browser.

### 4.2. The Fix: Server Proxy
Create an Astro API Endpoint to act as a proxy.
1.  Create `src/pages/api/proxy/[...path].ts`.
2.  The server fetches the external API (CORS doesn't apply server-to-server).
3.  The server forwards the response to the client.

**Example Proxy:**
```typescript
export const POST: APIRoute = async ({ request }) => {
  const response = await fetch("https://external-api.com/v1/chat", {
    method: "POST",
    headers: { Authorization: `Bearer ${import.meta.env.API_KEY}` },
    body: await request.text()
  });
  return new Response(response.body, { status: response.status });
}
```

## 5. Visual Flashes (Loading States)

### 5.1. The Trap
`client:only="react"` components do not render ANY HTML on the server. The user sees a blank space until the JS bundle loads and hydrates (Time to Interactive).

### 5.2. The Fix
Always provide a `slot="fallback"` with a Skeleton component.
```astro
<DeepResearchAgent client:only="react">
  <ToolSkeleton slot="fallback" />
</DeepResearchAgent>
```
*Note:* The Skeleton must be imported from a separate file (`src/components/ui/ToolSkeleton.tsx`) to be rendered by Astro during build.

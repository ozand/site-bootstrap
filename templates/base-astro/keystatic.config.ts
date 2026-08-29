import { config, fields, collection, singleton } from '@keystatic/core';

// CMS contract. MUST stay in sync with the Zod schemas in src/content.config.ts:
// every field added/renamed here must be mirrored there, and vice versa.
//
// storage: 'local' — development-only edits write directly to the working tree.
// Private hosted editor: switch to GitHub mode and set KEYSTATIC_* host env vars:
//   storage: { kind: 'github', repo: { owner: '<owner>', name: '__SITE_NAME__' } }
// Never place GitHub credentials, client secrets, or KEYSTATIC_SECRET in Git.
export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: '__SITE_NAME__' },
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          description: 'Meta description / summary (SEO)',
          multiline: true,
        }),
        pubDate: fields.date({ label: 'Publish date' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({ label: 'Site name', defaultValue: '__SITE_NAME__' }),
        tagline: fields.text({ label: 'Tagline' }),
      },
    }),
  },
});

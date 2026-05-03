---
name: plural-collection-routes
description: Use when naming, linking, or documenting routes for content collections such as blogs, projects, posts, tags, or categories.
---

# Plural Collection Routes

## Rule

Use plural route names and labels for collection pages.

## Examples

- Use `/blogs` for the blog index and blog post URLs.
- Use `Blogs` for navigation labels when referring to the collection.
- Avoid singular collection routes like `/blog` when the page represents a
  growing set of entries.

## Checklist

- Update route directories.
- Preserve old singular public routes with redirects when renaming an existing
  route.
- Handle both the index route and wildcard child routes, e.g. `/blog` and
  `/blog/*` should redirect to `/blogs` and `/blogs/*`.
- Update navigation links and active-state checks.
- Update generated sitemap routes.
- Update internal links in pages/components.
- Update README or docs references.

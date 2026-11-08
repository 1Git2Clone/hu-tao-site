---
name: blog-assets-by-slug
description: Use when adding, moving, or linking assets owned by a blog post, including preview images and downloads.
---

# Blog Assets by Slug

Group public blog assets by the owning post's slug, then by asset type.
Use `static/blogs/<slug>/images/<image>` for images. Other asset types belong
under the same blog directory in their own appropriate subdirectory.

A blog owns its assets; do not group all blogs beneath `static/images/blogs/`.
Use `/blogs/<slug>/images/<image>` in article content and preview metadata.
Update both references when moving an image used in both places.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio and blog site built with **SvelteKit** and **TypeScript**,
featuring a custom markdown-based blog system with math rendering, code syntax
highlighting, and a reading time calculator.

## Development Commands

- **`npm run dev`** — Start the development server
- **`npm run build`** — Build for production
- **`npm run preview`** — Preview the production build locally
- **`npm run check`** — Type check and validate Svelte components
- **`npm run check:watch`** — Type check in watch mode
- **`npm run lint`** — Run Prettier and ESLint checks
- **`npm run format`** — Auto-format code with Prettier and Tailwind CSS

## Code Architecture

### File Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── blog/            # Blog-specific components (MarkdownLayout, TableOfContents)
│   │   ├── layout/          # Layout components (Header, Nav, Footer, ThemeToggle)
│   │   ├── icons/           # SVG icon components
│   │   ├── root/            # Root page components
│   │   └── *.svelte         # Content components (CodeBlock, Highlight, Math, YouTube)
│   ├── content/             # Markdown content and data files
│   │   ├── posts/           # Blog posts in .md format
│   │   ├── about-me/        # About page content (projects.ts)
│   │   └── root/            # Root page data (history tree, etc.)
│   ├── data/                # TypeScript data definitions (posts.ts)
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions (slugify, snippets, consts)
│   └── styles/              # Global styles (fonts, KaTeX CSS)
├── routes/                  # SvelteKit page routes
│   ├── +page.svelte         # Home page
│   ├── about-me/            # About page
│   ├── blog/                # Blog listing
│   └── blog/[slug]/         # Individual blog post pages
└── app.html                 # Root HTML template
```

### Markdown Blog System

Blog posts are located in `src/lib/content/posts/` as `.md` files. Each post has **YAML frontmatter** with metadata:

```markdown
---
title: Post Title
summary: Brief description
date: Month Day Year
tags: ['dsa', 'cs']
---
```

**Post Metadata** extracted from frontmatter includes:

- `title`, `summary`, `date`, `tags`
- `headings` — auto-extracted H2/H3 headings with KaTeX math rendering support
- `readingTime` — calculated automatically
- `snippets` — code snippets referenced in the post

### Custom Markdown Plugins

Custom plugins are in `plugins/` directory and configured in `svelte.config.js`:

- **`remarkHeadings`** — Extracts H2/H3 headings, renders inline math in heading text, generates anchor IDs
- **`remarkReadingTime`** — Calculates reading time and adds to frontmatter
- **`remarkYouTube`** — Converts YouTube embed syntax to components
- **`remarkCodeBlock`** — Processes code blocks with syntax highlighting via Shiki
- **`remarkBlogAssets`** — Handles asset paths in markdown (images, snippets)
- **`rehypeHeadingIds`** — Generates stable IDs for all headings
- **`REHYPE_KATEX`** — Renders LaTeX math expressions

### Key Components

- **`MarkdownLayout.svelte`** — Wrapper for all blog posts; provides title, date, reading time, and table of contents
- **`TableOfContents.svelte`** — Auto-generated navigation from post headings
- **`CodeBlock.svelte`** — Syntax-highlighted code blocks with language detection
- **`Math.svelte`** — Inline and display math rendering (KaTeX)
- **`YouTube.svelte`** — Embedded YouTube videos from markdown

### Data Loading & Routing

- **`src/routes/blog/[slug]/+page.server.ts`** — Loads post markdown via `import.meta.glob` with eager loading
- Posts are identified by URL slug matching filename (minus `.md`)
- Metadata extracted from frontmatter automatically passed to `+page.svelte`
- Snippets loaded dynamically based on paths referenced in post metadata

### Styling

- **Tailwind CSS** with typography and forms plugins
- **Dark mode** via `mode-watcher` (auto detects system preference)
- **Custom CSS** for KaTeX and fonts in `src/lib/styles/`
- **Prose styling** applied via Tailwind typography plugin for blog content

## Code Style & Standards

- **Formatting**: Prettier with tabs (2-space indent), Svelte and Tailwind CSS plugins enabled
- **Linting**: ESLint with Svelte plugin, no-console warnings
- **TypeScript**: Strict mode enabled, all types must be explicit
- **Print width**: 100 characters (Prettier)
- **Svelte**: Use `$props`, `$derived` syntax (Svelte 5 runes)

## Deployment

- Adapter: **Netlify** (`@sveltejs/adapter-netlify`)
- Build output directory configured in `svelte.config.js`
- Environment-specific build handled by adapter

## Dependencies to Know

- **`marked`** & **`mdsvex`** — Markdown to Svelte compilation
- **`remark`/`rehype`** plugins — AST manipulation for markdown
- **`katex`** — LaTeX math rendering
- **`shiki`** — Syntax highlighting for code blocks
- **`fuse.js`** — Fuzzy search (used on blog page if `POST_SEARCH_FZF` is true)
- **`clsx`** — Conditional CSS class utility
- **`reading-time`** — Estimate reading duration

# 1Git2Clone Portfolio

[![Website Icon]][Website]&emsp;[![CI Icon]][CI]&emsp;[![Netlify Icon]][Netlify Deploy]&emsp;[![SvelteKit Icon]][SvelteKit]

[Website Icon]: https://img.shields.io/badge/site-hu--tao.org-red
[Website]: https://hu-tao.dev
[CI Icon]: https://github.com/1Git2Clone/hu-tao-site/actions/workflows/ci.yml/badge.svg?branch=main
[CI]: https://github.com/1Git2Clone/hu-tao-site/actions/workflows/ci.yml?query=branch%3Amain
[Netlify Icon]: https://api.netlify.com/api/v1/badges/4b1d57b6-8406-4e40-8a61-0ee9995cbc15/deploy-status
[Netlify Deploy]: https://app.netlify.com/projects/1g2c/deploys
[SvelteKit Icon]: https://img.shields.io/badge/SvelteKit-2-ff3e00
[SvelteKit]: https://svelte.dev/docs/kit/introduction

<!-- markdownlint-disable MD033 -->
<p>
  <img
    height="50px"
    src="https://codeberg.org/1Kill2Steal/skill-icons/raw/branch/main/icons/Svelte.svg"
    alt="Svelte"
  />
  <img
    height="50px"
    src="https://codeberg.org/1Kill2Steal/skill-icons/raw/branch/main/icons/TypeScript.svg"
    alt="TypeScript"
  />
  <img
    height="50px"
    src="https://codeberg.org/1Kill2Steal/skill-icons/raw/branch/main/icons/TailwindCSS-Dark.svg"
    alt="Tailwind CSS"
  />
  <img
    height="50px"
    src="https://codeberg.org/1Kill2Steal/skill-icons/raw/branch/main/icons/Markdown-Dark.svg"
    alt="Markdown"
  />
  <img
    height="50px"
    src="https://codeberg.org/1Kill2Steal/skill-icons/raw/branch/main/icons/Netlify-Dark.svg"
    alt="Netlify"
  />
</p>
<!-- markdownlint-enable MD033 -->

Personal portfolio and blog for Ivan Kirilov / 1Git2Clone. The site is built
with SvelteKit, Svelte 5, Tailwind CSS v4, and mdsvex, then deployed to
Netlify.

It is not a generic starter template. The monospace typography, red accent
palette, dark/light theme, technical project cards, and Markdown-powered blog
are all part of the site's identity.

## Table Of Contents

- [1Git2Clone Portfolio](#1git2clone-portfolio)
  - [Getting Started](#getting-started)
    - [Get The Repo](#get-the-repo)
    - [Install Dependencies](#install-dependencies)
    - [Run Locally](#run-locally)
    - [Check The Project](#check-the-project)
    - [Build The Project](#build-the-project)
    - [Preview The Build](#preview-the-build)
  - [File Structure](#file-structure)
  - [Content](#content)
    - [Portfolio Projects](#portfolio-projects)
    - [Blog Posts](#blog-posts)
    - [Site Constants](#site-constants)
  - [Styling](#styling)
  - [Deployment](#deployment)
  - [Maintenance Notes](#maintenance-notes)
  - [License](#license)

## Getting Started

### Get The Repo

```sh
git clone https://github.com/1Git2Clone/1g2c-site
cd 1g2c-site
```

### Install Dependencies

```sh
pnpm install
```

### Run Locally

```sh
pnpm run dev
```

### Check The Project

```sh
pnpm run check
```

This runs `svelte-kit sync` and `svelte-check` against the project TypeScript
configuration.

### Build The Project

```sh
pnpm run build
```

### Preview The Build

```sh
pnpm run preview
```

## File Structure

```text
1g2c-site
├── AGENTS.md                         # Project instructions for coding agents
├── netlify.toml                      # Netlify build configuration
├── package.json                      # Scripts and dependencies
├── plugins
│   ├── rehype                        # HTML transforms for mdsvex output
│   │   ├── heading-ids.js            # Stable heading IDs
│   │   └── katex.js                  # KaTeX HTML handling
│   ├── remark                        # Markdown transforms
│   │   ├── blog-assets.js            # Blog-local asset handling
│   │   ├── code-block.js             # Code block metadata/rendering support
│   │   ├── headings.js               # Heading extraction
│   │   ├── reading-time.js           # Reading-time metadata
│   │   └── youtube.js                # YouTube embed syntax
│   └── utils.js                      # Shared plugin helpers
├── src
│   ├── lib
│   │   ├── components
│   │   │   ├── blog                  # Markdown layout and table of contents
│   │   │   ├── icons                 # Social icons
│   │   │   └── layout                # Header, nav, footer, theme toggle
│   │   ├── content
│   │   │   ├── about-me              # Project data for the portfolio page
│   │   │   ├── posts                 # mdsvex blog posts and post assets
│   │   │   └── root                  # Homepage content data
│   │   ├── styles                    # Font and KaTeX styles
│   │   ├── types                     # Shared TypeScript types
│   │   └── utils                     # Constants, slug helpers, snippets
│   └── routes
│       ├── about-me                  # Portfolio/about page
│       ├── blogs                     # Blogs index and post routes
│       ├── sitemap.xml               # Sitemap endpoint
│       ├── +layout.svelte            # App shell
│       ├── +page.svelte              # Homepage
│       └── layout.css                # Tailwind v4 theme and global styles
├── static
│   └── fonts                         # Optimized JetBrains Mono / KaTeX fonts
└── install_required_font_symbols.sh  # Font subset helper
```

## Content

### Portfolio Projects

Portfolio project cards are data-driven from:

```text
src/lib/content/about-me/projects.ts
```

Each project can define a title, source URL, confidential/private marker,
typed tech stack, summary, Markdown description, licenses, and tags. Tech stack
labels link to their official project pages through the `TECH_URLS` map.

### Blog Posts

Blog posts live in:

```text
src/lib/content/posts/
```

Posts are Markdown files processed through mdsvex and custom remark/rehype
plugins. The pipeline supports reading time, heading extraction, stable heading
IDs, KaTeX math, code blocks, YouTube embeds, and blog-local assets.

### Site Constants

Shared constants live in:

```text
src/lib/utils/consts.ts
```

This includes the GitHub username, Twitter handle, site title, current year,
blog extension, and contact email.

## Styling

The visual system is defined primarily in `src/routes/layout.css` with
Tailwind CSS v4 theme tokens.

Key conventions:

- JetBrains Mono Nerd Font is used throughout the site.
- Theme colors are tokenized in CSS; avoid hardcoded inline hex values.
- Dark mode is driven by `mode-watcher`.
- Markdown pages use `prose` and `dark:prose-invert`.
- Component styling should prefer Tailwind utility classes.
- Raw CSS should be reserved for pseudo-elements, complex selectors, keyframes,
  or reusable component-specific effects.

## Deployment

The site is configured for Netlify through `@sveltejs/adapter-netlify` and
`netlify.toml`.

Netlify runs:

```sh
pnpm run build
```

and publishes:

```text
build
```

## Maintenance Notes

- Run `pnpm run check` before committing Svelte or TypeScript changes.
- Run `pnpm run lint` when working on formatting or lint cleanup. There may be
  existing repo-wide formatting noise, so inspect the current diff before broad
  formatting changes.
- Run `install_required_font_symbols.sh` after adding glyphs that must be
  included in the optimized font subset.
- Do not commit secrets, `.env` files, tokens, or private credentials.

## License

[MIT](LICENSE), except for third-party files, which keep their own licenses:

- `static/fonts/`: JetBrains Mono Nerd Font and the KaTeX fonts.
- `static/images/`: the art belongs to its artists.

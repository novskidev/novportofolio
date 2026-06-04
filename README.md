# Novskidev

Personal portfolio and writing space for Novian Nadari, built with Astro.

## Purpose

This project powers `novski.dev`. It is used to collect personal profile information, project notes, blog posts, short updates, and contact links in one static website.

## Stack

- Astro
- Bun
- TypeScript
- MDX
- Pagefind
- Tailwind CSS through Vite

## Local Development

Install dependencies:

```sh
bun install
```

Start the dev server:

```sh
bun run dev
```

Build for production:

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

## Content

Main content lives in these files and folders:

```text
src/config/site.toml        Site profile, navigation, theme, comments, and homepage data
src/pages/about.astro       About page
src/content/blog/           Blog posts
src/content/projects/       Project index and project notes
src/content/vibe/           Short updates
public/images/              Static images and icons
```

Create new content:

```sh
bun run post:new my-first-post
bun run project:new my-project
bun run vibe:new today-note
```

Blog posts and project notes are created as MDX files by default, so content can use Markdown and Astro components in the same document.

Comments are currently disabled in `src/config/site.toml` and can be configured later when needed.

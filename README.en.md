# Novskidev

Personal portfolio and writing space for Novian Nadari, built with Astro.

## Overview

This repository contains the source code for `novski.dev`. The site is designed as a personal portfolio with room for projects, notes, short updates, and contact information.

## Commands

```sh
bun install
bun run dev
bun run build
bun run preview
```

## Project Structure

```text
public/                     Static files and images
src/config/site.toml        Site-level configuration
src/pages/about.astro       About page content
src/content/blog/           Blog posts
src/content/projects/       Project content
src/content/vibe/           Short notes
src/components/             Astro components
src/layouts/                Page and article layouts
src/pages/                  Routes
src/styles/                 Global styles and palettes
```

## Notes

Blog posts and project notes are created as MDX files by default, so content can use Markdown and Astro components in the same document.

Comments are disabled for now. The site can be deployed as a static Astro build to GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static hosting provider.

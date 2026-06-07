# Content Guide

This site has three content types: blog posts, project notes, and vibe updates.

## Commands

Create a draft blog post:

```sh
bun run post:new my-first-post
```

Create a published blog post:

```sh
bun run post:new my-first-post --publish
```

Create a project note:

```sh
bun run project:new portfolio-redesign
```

Create a vibe update:

```sh
bun run vibe:new today-update
```

## Blog

Use `src/content/blog` for longer writing: essays, tutorials, notes, and technical posts.

```yaml
---
title: 'My First Post'
description: 'Short summary for SEO and archive cards.'
date: '2026-06-04T12:43:56.381Z'
draft: false
showHeroImage: false
tags: [astro, mdx]
categories: [Web Development]
series: []
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---
```

- `draft`: Set to `true` to hide a post from lists, routes, RSS, and related posts.
- `description`: Used for SEO metadata and blog archive excerpts.
- `tags`: Specific keywords such as `astro`, `mdx`, or `typescript`.
- `categories`: Larger topic groups such as `Web Development` or `Notes`.
- `series`: A reading path for connected posts. Leave empty for standalone posts.
- `showHeroImage`: Set to `true` only when `heroImage` is provided.
- `sidebar.relatedPosts`: Controls the related post block below the article.

## Tags, Categories, And Series

- Tags are clickable at `/blog/tags/` and `/blog/tags/[tag]/`.
- Categories are clickable at `/blog/categories/` and `/blog/categories/[category]/`.
- Series are clickable at `/blog/series/` and `/blog/series/[series]/`.

Use categories for broad organization, tags for precise keywords, and series for ordered multi-part writing.

## Projects

Use `src/content/projects` for portfolio work, case studies, experiments, and project notes.

Project entries use the same article-style frontmatter as blog posts, but comments and sidebar are usually disabled.

## Vibe

Use `src/content/vibe` for short updates, fragments, quick notes, photos, quotes, or lightweight logs.

```yaml
---
title: 'Ngoprek Astro'
date: '2026-06-04T12:43:56.381Z'
updatedDate: '2026-06-04T12:43:56.381Z'
draft: false
type: text
mood: 'focused'
location: 'Remote'
images: []
tags: [astro]
align: left
size: md
---
```

Choose blog for complete articles. Choose vibe for short, timeline-style updates.

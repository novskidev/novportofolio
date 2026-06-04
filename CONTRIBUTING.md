# Contributing

This is a personal portfolio project for Novian Nadari. Changes should stay focused on improving the site content, reading experience, performance, and maintainability.

## Local Checks

```sh
bun install
bun run dev
bun run build
bun run format:check
```

Run `bun install` only when dependencies are missing or changed. For meaningful code, route, schema, or configuration changes, run `bun run build` before publishing.

## Content Notes

- Site-wide profile and navigation data live in `src/config/site.toml`.
- Long-form posts live in `src/content/blog/`.
- Project notes live in `src/content/projects/`.
- Short updates live in `src/content/vibe/`.
- About page content lives in `src/pages/about.astro`.

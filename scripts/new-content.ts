import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type ContentType = 'blog' | 'project' | 'vibe' | 'tool';
type Extension = 'md' | 'mdx';

type ContentTypeConfig = {
  collectionName: ContentType;
  directory: string;
  defaultExtension: Extension;
  fileName: (slug: string, now: Date) => string;
  bodyTemplate: (title: string) => string;
  frontmatterTemplate: (title: string, isoDate: string, draft: boolean) => string;
};

const CONTENT_TYPES = {
  blog: {
    collectionName: 'blog',
    directory: 'src/content/blog',
    defaultExtension: 'mdx',
    fileName: (slug) => slug,
    bodyTemplate: createBlogBody,
    frontmatterTemplate: createBlogFrontmatter,
  },
  project: {
    collectionName: 'project',
    directory: 'src/content/projects',
    defaultExtension: 'mdx',
    fileName: (slug) => slug,
    bodyTemplate: createProjectBody,
    frontmatterTemplate: createProjectFrontmatter,
  },
  vibe: {
    collectionName: 'vibe',
    directory: 'src/content/vibe',
    defaultExtension: 'md',
    fileName: (slug, now) => `${formatDatePrefix(now)}-${slug}`,
    bodyTemplate: createVibeBody,
    frontmatterTemplate: createVibeFrontmatter,
  },
  tool: {
    collectionName: 'tool',
    directory: 'src/content/tools',
    defaultExtension: 'mdx',
    fileName: (slug) => slug.toLowerCase(),
    bodyTemplate: createToolBody,
    frontmatterTemplate: createToolFrontmatter,
  },
} satisfies Record<ContentType, ContentTypeConfig>;

const args = process.argv.slice(2);
const contentTypeArg = args[0];
const optionArgs = args.slice(1).filter((arg) => arg.startsWith('--'));
const filenameArg = args.find((arg, index) => index > 0 && !arg.startsWith('--'));

if (!isSupportedContentType(contentTypeArg)) {
  printUnsupportedContentType(contentTypeArg);
  process.exit(1);
}

if (filenameArg === undefined) {
  printMissingFilename();
  process.exit(1);
}

const slug = normalizeFilename(filenameArg);

if (!slug) {
  console.error('Invalid filename.');
  process.exit(1);
}

const now = new Date();
const isoDate = now.toISOString();
const config = CONTENT_TYPES[contentTypeArg];
const extension: Extension = optionArgs.includes('--mdx') ? 'mdx' : config.defaultExtension;
const draft = !optionArgs.includes('--publish');
const title = createTitle(slug);
const baseName = config.fileName(slug, now);
const relativePath = path.join(config.directory, `${baseName}.${extension}`);
const targetPath = path.resolve(relativePath);

if (existsSync(targetPath)) {
  console.error(`File already exists: ${relativePath}`);
  process.exit(1);
}

mkdirSync(path.dirname(targetPath), { recursive: true });
writeFileSync(
  targetPath,
  `${config.frontmatterTemplate(title, isoDate, draft)}\n\n${config.bodyTemplate(title)}\n`,
  'utf8',
);

console.log(`Created new ${config.collectionName} file:`);
console.log(relativePath);
console.log(
  `Status: ${draft ? 'draft. Set draft: false or pass --publish to publish.' : 'published.'}`,
);

function isSupportedContentType(value: string | undefined): value is ContentType {
  return value === 'blog' || value === 'project' || value === 'vibe' || value === 'tool';
}

function normalizeFilename(value: string): string {
  return value
    .trim()
    .replace(/\.(mdx?|MDX?)$/, '')
    .replace(/\s+/g, '-')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .replace(/\.+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .replace(/^-+|-+$/g, '');
}

function createTitle(slug: string): string {
  return slug
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((part) => {
      if (!/[A-Za-z]/.test(part)) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function formatDatePrefix(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function createBlogFrontmatter(title: string, isoDate: string, draft: boolean): string {
  return `---
title: "${escapeYamlString(title)}"
description: ""
date: "${isoDate}"
draft: ${draft}
showHeroImage: false
tags: []
categories: []
series: []
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---`;
}

function createProjectFrontmatter(title: string, isoDate: string, draft: boolean): string {
  return `---
title: "${escapeYamlString(title)}"
description: ""
date: "${isoDate}"
draft: ${draft}
showHeroImage: false
tags: []
categories: []
series: []
comments: false
sidebar:
  enable: false
  toc: false
  relatedPosts: false
---`;
}

function createVibeFrontmatter(title: string, isoDate: string, draft: boolean): string {
  return `---
title: "${escapeYamlString(title)}"
date: "${isoDate}"
updatedDate: "${isoDate}"
draft: ${draft}
type: text
mood: ""
location: ""
images: []
tags: []
align: left
size: md
---`;
}

function createToolFrontmatter(title: string, isoDate: string, draft: boolean): string {
  return `---
title: "${escapeYamlString(title)}"
description: ""
date: "${isoDate}"
draft: ${draft}
showHeroImage: false
# One of the existing categories keeps the /tools filter tidy.
category: ""
# daily-driver | using | tried | retired
status: using
# 0 to 5 in steps of 0.5
rating: 4
# free | freemium | paid | open-source
pricing: free
website: "https://example.com/"
verdict: ""
bestFor: ""
pros: []
cons: []
alternatives: []
# Reuse blog tags so related posts show up under the review.
tags: []
---`;
}

function createBlogBody(title: string): string {
  return `# ${title}

Start writing here.`;
}

function createProjectBody(title: string): string {
  return `# ${title}

Describe the project, goals, technical decisions, and results here.`;
}

function createToolBody(): string {
  return `## Why it is in my toolbox

What problem it solves for you.

## How I use it

- First use case

## Where it falls short

Honest limits and when to pick something else.`;
}

function createVibeBody(): string {
  return 'A small note from today.';
}

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function printMissingFilename(): void {
  console.error(`Please provide a filename.

Examples:
bun run post:new my-first-post
bun run post:new my-first-post --publish
bun run project:new my-project
bun run vibe:new today-cloud
bun run tool:new obsidian`);
}

function printUnsupportedContentType(contentType: string | undefined): void {
  console.error(`Unsupported content type: ${contentType ?? ''}

Supported types:
- blog
- project
- vibe
- tool`);
}

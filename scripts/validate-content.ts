import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const contentDirs = ['src/content/blog', 'src/content/projects', 'src/content/vibe'];
const contentExtensions = new Set(['.md', '.mdx']);
const requiredFields = ['title', 'date'];
const warnings: string[] = [];
const errors: string[] = [];

function walkFiles(dir: string) {
  if (!existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(path));
      continue;
    }

    if (entry.isFile() && contentExtensions.has(extname(entry.name))) files.push(path);
  }

  return files;
}

function extractFrontmatter(text: string) {
  if (!text.startsWith('---')) return '';

  const endIndex = text.indexOf('\n---', 3);
  return endIndex === -1 ? '' : text.slice(3, endIndex);
}

function getField(frontmatter: string, field: string) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.*)$`, 'm'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
}

for (const dir of contentDirs) {
  for (const file of walkFiles(dir)) {
    const label = relative(process.cwd(), file);
    const text = readFileSync(file, 'utf8');
    const frontmatter = extractFrontmatter(text);

    if (!frontmatter) {
      errors.push(`${label}: missing frontmatter block.`);
      continue;
    }

    for (const field of requiredFields) {
      if (!getField(frontmatter, field))
        errors.push(`${label}: missing required field '${field}'.`);
    }

    if (getField(frontmatter, 'draft') === 'true') {
      warnings.push(`${label}: still marked as draft.`);
    }

    if (!getField(frontmatter, 'description') && !label.includes('/vibe/')) {
      warnings.push(`${label}: description is empty.`);
    }
  }
}

for (const warning of warnings) console.warn(`Content warning: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`Content error: ${error}`);
  process.exit(1);
}

console.log(
  `Validated content with ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`,
);

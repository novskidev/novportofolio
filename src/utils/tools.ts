import type { CollectionEntry } from 'astro:content';

export type ToolEntry = CollectionEntry<'tools'>;
export type ToolStatus = ToolEntry['data']['status'];
export type ToolPricing = ToolEntry['data']['pricing'];

export const toolStatusLabels: Record<ToolStatus, string> = {
  'daily-driver': 'Daily driver',
  using: 'Using',
  tried: 'Tried',
  retired: 'Retired',
};

export const toolPricingLabels: Record<ToolPricing, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  'open-source': 'Open source',
};

const statusOrder: Record<ToolStatus, number> = {
  'daily-driver': 0,
  using: 1,
  tried: 2,
  retired: 3,
};

/** Daily drivers first, then by rating, then alphabetically. */
export function sortTools(tools: ToolEntry[]) {
  return [...tools].sort(
    (a, b) =>
      statusOrder[a.data.status] - statusOrder[b.data.status] ||
      b.data.rating - a.data.rating ||
      a.data.title.localeCompare(b.data.title),
  );
}

export function formatRating(rating: number) {
  return Number.isInteger(rating) ? `${rating}.0` : rating.toFixed(1);
}

export function slugifyCategory(category: string) {
  return category
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

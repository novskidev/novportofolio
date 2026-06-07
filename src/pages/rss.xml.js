import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getSiteConfig } from '../data/site';
import { sortByDateDesc } from '../utils/content-dates';

export async function GET(context) {
  const { site } = await getSiteConfig();
  const posts = sortByDateDesc(await getCollection('blog', ({ data }) => !data.draft));
  const vibes = sortByDateDesc(await getCollection('vibe', ({ data }) => !data.draft));
  const items = sortByDateDesc([
    ...posts.map((post) => ({
      id: post.id,
      data: post.data,
      title: post.data.title,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    ...vibes.map((vibe) => ({
      id: vibe.id,
      data: vibe.data,
      title: vibe.data.title ?? 'Vibe update',
      description:
        [vibe.data.mood, vibe.data.location, vibe.data.tags.join(', ')]
          .filter(Boolean)
          .join(' · ') || 'Short update from the vibe stream.',
      link: '/vibe/',
    })),
  ]);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: items.map((item) => ({
      title: item.title,
      description: item.description,
      pubDate: item.data.date,
      link: item.link,
    })),
  });
}

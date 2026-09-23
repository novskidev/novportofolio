const REVEAL_SELECTOR = [
  '.post-item',
  '.project-card',
  '.category-card',
  '.series-card',
  '.vibe-item',
  '.tag-cloud a',
  '.blog-tag-cloud a',
  '.related-posts',
].join(',');

let observer: IntersectionObserver | undefined;

function reveal() {
  const root = document.documentElement;

  // Progressive enhancement: elements stay visible unless this attribute is set,
  // so no-JS / script-error / reduced-motion never leaves content hidden.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.removeAttribute('data-reveal');
    return;
  }

  root.dataset.reveal = 'on';
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = 'true';
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.18 },
  );

  for (const element of document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)) {
    if (element.dataset.revealed) continue;
    observer.observe(element);
  }
}

reveal();
document.addEventListener('astro:page-load', reveal);

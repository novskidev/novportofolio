import { animate, inView, stagger } from 'motion';

type Cleanup = () => void;

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let cleanupTasks: Cleanup[] = [];

function cleanupFramerAnimations() {
  for (const cleanup of cleanupTasks) cleanup();
  cleanupTasks = [];
}

function shouldSkipMotion() {
  return reduceMotionQuery.matches;
}

function getElements(selector: string, flag = 'framerMotionMounted') {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => !element.dataset[flag],
  );
}

function markMounted(elements: HTMLElement[], flag = 'framerMotionMounted') {
  for (const element of elements) element.dataset[flag] = 'true';
}

function animateEntrance(elements: HTMLElement[], delay = 0) {
  if (elements.length === 0) return;

  markMounted(elements, 'framerEntranceMounted');
  animate(
    elements,
    {
      opacity: [0, 1],
      y: [14, 0],
      filter: ['blur(5px)', 'blur(0px)'],
    },
    {
      delay: stagger(0.045, { startDelay: delay }),
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
    },
  );
}

function mountTopLevelMotion() {
  const nav = document.querySelector<HTMLElement>('.blog-top-nav');
  if (nav) {
    // Keep the fixed navbar free of inline transform/opacity so scroll-hide CSS can control it.
    nav.style.removeProperty('opacity');
    nav.style.removeProperty('transform');
    nav.style.removeProperty('filter');
  }

  animateEntrance(
    getElements(
      [
        '.profile-card',
        '.intro-card',
        '.github-activity-card',
        '.nav-card',
        '.doing-card',
        '.archive-header-shared',
        '.article-card',
      ].join(','),
      'framerEntranceMounted',
    ),
    0.04,
  );
}

function mountScrollRevealMotion() {
  const revealSelector = [
    '.post-item',
    '.project-card',
    '.category-card',
    '.series-card',
    '.tag-cloud a',
    '.blog-tag-cloud a',
    '.vibe-item',
    '.related-posts',
  ].join(',');

  for (const element of getElements(revealSelector, 'framerRevealMounted')) {
    element.dataset.framerRevealMounted = 'true';
    const cleanup = inView(
      element,
      () => {
        animate(
          element,
          {
            opacity: [0, 1],
            y: [18, 0],
            filter: ['blur(5px)', 'blur(0px)'],
          },
          { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
        );
      },
      { amount: 0.18, margin: '0px 0px -8% 0px' },
    );

    cleanupTasks.push(cleanup);
  }
}

function mountHoverMotion() {
  const hoverTargets = getElements(
    [
      '.nav-link',
      '.mobile-menu-link',
      '.tag-cloud a',
      '.blog-tag-cloud a',
      '.related-posts a',
      '.post-group',
      '.post-tag',
      '.group-link',
      '.site-search-trigger',
      '.brand-mark',
    ].join(','),
    'framerHoverMounted',
  );

  for (const element of hoverTargets) {
    element.dataset.framerHoverMounted = 'true';

    const enter = () => {
      animate(element, { scale: 1.018, y: -1 }, { duration: 0.16, ease: 'easeOut' });
    };
    const leave = () => {
      animate(element, { scale: 1, y: 0 }, { duration: 0.18, ease: 'easeOut' });
    };
    const down = () => {
      animate(element, { scale: 0.985 }, { duration: 0.08, ease: 'easeOut' });
    };
    const up = () => {
      animate(element, { scale: 1.018 }, { duration: 0.12, ease: 'easeOut' });
    };

    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointerdown', down);
    element.addEventListener('pointerup', up);
    cleanupTasks.push(() => {
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointerdown', down);
      element.removeEventListener('pointerup', up);
    });
  }
}

function mountThemeToggleMotion() {
  for (const button of getElements(
    '[data-theme-toggle], [data-palette-toggle]',
    'framerThemeMounted',
  )) {
    button.dataset.framerThemeMounted = 'true';

    const click = () => {
      animate(button, { rotate: [0, -10, 10, 0], scale: [1, 0.94, 1] }, { duration: 0.32 });
    };

    button.addEventListener('click', click);
    cleanupTasks.push(() => button.removeEventListener('click', click));
  }
}

export function mountFramerAnimations() {
  cleanupFramerAnimations();

  if (shouldSkipMotion()) {
    document.documentElement.dataset.motion = 'reduced';
    return;
  }

  document.documentElement.dataset.motion = 'framer';
  mountTopLevelMotion();
  mountScrollRevealMotion();
  mountHoverMotion();
  mountThemeToggleMotion();
}

document.addEventListener('astro:before-swap', cleanupFramerAnimations);
document.addEventListener('astro:page-load', mountFramerAnimations);

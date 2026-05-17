import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Katas',
      href: getPermalink('/katas'),
    },
    {
      text: 'Sources',
      href: 'https://github.com/evilz/code-katas/tree/main/katas',
    },
    {
      text: 'GitHub',
      href: 'https://github.com/evilz/code-katas',
    },
  ],
  actions: [{ text: 'Browse katas', href: getPermalink('/katas') }],
};

export const footerData = {
  links: [
    {
      title: 'Catalog',
      links: [
        { text: 'All katas', href: getPermalink('/katas') },
        { text: 'Source tree', href: 'https://github.com/evilz/code-katas/tree/main/katas' },
      ],
    },
    {
      title: 'Sources',
      links: [
        { text: 'Original repositories', href: getPermalink('/katas') },
        { text: 'Migration repository', href: 'https://github.com/evilz/code-katas' },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/evilz/code-katas' },
  ],
  footNote: `
    Consolidated by <a class="text-blue-600 underline dark:text-muted" href="https://github.com/evilz">evilz</a>.
  `,
};

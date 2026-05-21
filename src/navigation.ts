import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
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
      title: 'Repository',
      links: [
        { text: 'GitHub repository', href: 'https://github.com/evilz/code-katas' },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [{ ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/evilz/code-katas' }],
  footNote: `
    Consolidated by <a class="text-blue-600 underline dark:text-muted" href="https://github.com/evilz">evilz</a>.
  `,
};

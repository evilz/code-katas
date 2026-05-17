import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getPermalink } from '~/utils/permalinks';

export type KataEntry = CollectionEntry<'kata'>;

export type Kata = KataEntry['data'] & {
  id: string;
  slug: string;
  href: string;
};

export const getKataSlug = (id: string) => id.replace(/\.(md|mdx)$/i, '');

export const getKataHref = (id: string) => getPermalink(`/katas/${getKataSlug(id)}`);

export const fetchKatas = async (): Promise<Kata[]> => {
  const entries = await getCollection('kata');

  return entries
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .map((entry) => {
      const slug = getKataSlug(entry.id);

      return {
        ...entry.data,
        id: entry.id,
        slug,
        href: getPermalink(`/katas/${slug}`),
      };
    });
};

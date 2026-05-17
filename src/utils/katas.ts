import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';

import { getPermalink } from '~/utils/permalinks';

export type KataEntry = CollectionEntry<'kata'>;

export type Kata = {
  id: string;
  folder: string;
  slug: string;
  href: string;
  title: string;
  summary: string;
  languages: string[];
  topics: string[];
  readmePath: string;
  repositoryPath: string;
  repositoryUrl: string;
  sourceUrl?: string;
};

const TITLE_OVERRIDES: Record<string, string> = {
  args: 'Args',
  ddd: 'DDD',
  'fizz-buzz': 'Fizz Buzz',
  'foo-bar-qix': 'FooBarQix',
  'kata-train-reservation': 'Kata Train Reservation',
  'mini-pricer': 'Mini Pricer',
  'movie-rental': 'Movie Rental',
  'prime-factor': 'Prime Factor',
  'racing-car-katas': 'Racing Car Katas',
  'refactoring-guru-examples': 'Refactoring Guru Examples',
  'roman-numerals': 'Roman Numerals',
  'string-calculator': 'String Calculator',
  'tic-tac-toe': 'Tic Tac Toe',
  'trip-service': 'Trip Service',
};

const TDD_KATAS = new Set([
  'args',
  'bowling-game',
  'ddd',
  'diamond',
  'file-system',
  'fizz-buzz',
  'foo-bar-qix',
  'game-of-life',
  'kata-train-reservation',
  'leap-years',
  'minesweeper',
  'mini-pricer',
  'prime-factor',
  'reload-countdown',
  'roman-numerals',
  'string-calculator',
  'tennis-game',
  'tic-tac-toe',
]);

const REFACTORING_KATAS = new Set([
  'gilded-rose',
  'movie-rental',
  'racing-car-katas',
  'refactoring-guru-examples',
  'tennis',
  'trip-service',
  'trivia',
  'yatzy',
]);

const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.idea',
  '.vs',
  '.vscode',
  'bin',
  'build',
  'dist',
  'node_modules',
  'obj',
  'packages',
  'target',
]);

const LANGUAGE_BY_EXTENSION = new Map([
  ['.c', 'C'],
  ['.clj', 'Clojure'],
  ['.cpp', 'C++'],
  ['.cs', 'C#'],
  ['.css', 'CSS'],
  ['.db', 'SQLite'],
  ['.fs', 'F#'],
  ['.fsx', 'F#'],
  ['.h', 'C/C++'],
  ['.hpp', 'C++'],
  ['.html', 'HTML'],
  ['.java', 'Java'],
  ['.js', 'JavaScript'],
  ['.json', 'JSON'],
  ['.php', 'PHP'],
  ['.py', 'Python'],
  ['.rb', 'Ruby'],
  ['.scala', 'Scala'],
  ['.sql', 'SQL'],
  ['.ts', 'TypeScript'],
]);

const readEntryBody = (entry: KataEntry): string =>
  'body' in entry && typeof entry.body === 'string' ? entry.body : '';

export const getKataFolder = (id: string) => id.replaceAll('\\', '/').split('/')[0];

export const getKataSlug = (id: string) => getKataFolder(id);

export const getKataHref = (id: string) => getPermalink(`/katas/${getKataSlug(id)}`);

const titleFromSlug = (slug: string) =>
  TITLE_OVERRIDES[slug] ??
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const titleFromMarkdown = (body: string) => body.match(/^#\s+(.+)$/m)?.[1]?.trim();

const stripMarkdown = (value: string) =>
  value
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const summaryFromMarkdown = (body: string) => {
  const paragraph = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith('#') && !block.startsWith('```') && !block.startsWith('|'));

  return paragraph ? stripMarkdown(paragraph) : undefined;
};

const inferTopics = (folder: string, body: string) => {
  const topics = new Set<string>(['kata']);
  const searchable = `${folder} ${body}`.toLowerCase();

  if (TDD_KATAS.has(folder) || searchable.includes('tdd') || searchable.includes('test driven')) {
    topics.add('tdd');
  }

  if (REFACTORING_KATAS.has(folder) || searchable.includes('refactor') || searchable.includes('legacy')) {
    topics.add('refactoring');
  }

  if (searchable.includes('multi-language') || searchable.includes('several language')) {
    topics.add('multi-language');
  }

  if (folder === 'millenium-falcon-challenge' || searchable.includes('technical test')) {
    topics.add('challenge');
  }

  if (folder === 'refactoring-guru-examples') {
    topics.add('examples');
  }

  return Array.from(topics).sort();
};

const detectLanguages = async (folder: string) => {
  const counts = new Map<string, number>();
  const kataPath = path.join(process.cwd(), 'katas', folder);

  const visit = async (directory: string) => {
    const children = await fs.readdir(directory, { withFileTypes: true });

    await Promise.all(
      children.map(async (child) => {
        if (child.isDirectory()) {
          if (!IGNORED_DIRECTORIES.has(child.name)) {
            await visit(path.join(directory, child.name));
          }
          return;
        }

        if (!child.isFile()) return;

        const language = LANGUAGE_BY_EXTENSION.get(path.extname(child.name).toLowerCase());
        if (language) {
          counts.set(language, (counts.get(language) ?? 0) + 1);
        }
      })
    );
  };

  await visit(kataPath);

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([language]) => language)
    .slice(0, 6);
};

export const getKataFromEntry = async (entry: KataEntry): Promise<Kata> => {
  const folder = getKataFolder(entry.id);
  const body = readEntryBody(entry);
  const title = entry.data.title ?? titleFromMarkdown(body) ?? titleFromSlug(folder);
  const summary = entry.data.summary ?? summaryFromMarkdown(body) ?? `${title} kata and practice exercise.`;
  const languages = entry.data.languages ?? (await detectLanguages(folder));
  const topics = entry.data.topics ?? inferTopics(folder, body);

  return {
    id: entry.id,
    folder,
    slug: folder,
    href: getPermalink(`/katas/${folder}`),
    title,
    summary,
    languages,
    topics,
    readmePath: `katas/${folder}/README.md`,
    repositoryPath: `katas/${folder}`,
    repositoryUrl: `https://github.com/evilz/code-katas/tree/main/katas/${folder}`,
    sourceUrl: entry.data.sourceUrl,
  };
};

export const fetchKatas = async (): Promise<Kata[]> => {
  const entries = await getCollection('kata');
  const katas = await Promise.all(entries.map((entry) => getKataFromEntry(entry)));

  return katas.sort((a, b) => a.title.localeCompare(b.title));
};

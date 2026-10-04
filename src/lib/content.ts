/**
 * All page copy and links live here so presentation stays separate from
 * content. Editing this file is the only change needed to revise wording.
 */

export type Project = {
  name: string;
  href: string;
  summary: string;
  /** Shown as a small meta line under the summary. */
  meta: string;
  kind: string;
};

export const PROJECTS: Project[] = [
  {
    name: 'izen',
    href: 'https://pizenlabs.github.io/izen314/',
    summary:
      'AI amplifies human judgment. The operator stays in control of what the system is allowed to do.',
    meta: 'Live at pizenlabs.github.io/izen314',
    kind: 'Applied',
  },
  {
    name: 'lynx',
    href: 'https://github.com/PizenLabs/lynx',
    summary:
      'Symbol-first repository discovery engine for AI-native developer tooling.',
    meta: 'github.com/PizenLabs/lynx',
    kind: 'Open source',
  },
];

export type Principle = {
  index: string;
  icon: 'eye' | 'terminal' | 'branch' | 'arrow';
  title: string;
  body: string;
};

export const PRINCIPLES: Principle[] = [
  {
    index: '01',
    icon: 'eye',
    title: 'Inspect',
    body: 'Every claim is checkable against the code. You should never have to take our word for it.',
  },
  {
    index: '02',
    icon: 'terminal',
    title: 'Understand',
    body: 'Understanding is part of the product, not a bonus feature shipped with it.',
  },
  {
    index: '03',
    icon: 'branch',
    title: 'Fork freely',
    body: 'Extend it, remix it, break it. The work exists to be taken apart.',
  },
  {
    index: '04',
    icon: 'arrow',
    title: 'Contribute',
    body: 'Open an issue, send a patch. Small and considered changes are welcome.',
  },
];

export const NAV_LINKS = [
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Work', href: '#work' },
  { label: 'Principles', href: '#principles' },
];

export const GITHUB_URL = 'https://github.com/PizenLabs';
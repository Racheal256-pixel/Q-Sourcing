import type { AppState, Candidate, Interest, Opportunity } from '../types';

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'gig-frontend',
    title: 'Frontend Developer (React)',
    employer: 'Kampala Fintech Lab',
    description:
      'Build and maintain customer-facing screens for a small payments product. Work with a designer and a two-person backend team. Hybrid: three days in the office, two days remote.',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Git'],
    niceToHaveSkills: ['Figma', 'REST APIs'],
    location: 'Kampala',
    workType: 'Full-time',
    minYearsExperience: 2,
    startNeed: 'Within 2 weeks',
    createdAt: '2026-10-29T06:30:00.000Z',
  },
  {
    id: 'gig-social',
    title: 'Social Media Manager',
    employer: 'Ntinda Coffee Co.',
    description:
      'Plan and publish weekly content for a growing coffee brand. Own the content calendar, shoot simple phone photos, and report on reach once a month. Fully remote, part-time.',
    requiredSkills: ['Content writing', 'Instagram', 'Canva'],
    niceToHaveSkills: ['Analytics', 'Photography'],
    location: 'Remote',
    workType: 'Part-time',
    minYearsExperience: 1,
    startNeed: 'Within a month',
    createdAt: '2026-10-29T07:00:00.000Z',
  },
  {
    id: 'gig-barista',
    title: 'Weekend Barista',
    employer: 'Kololo Roasters',
    description:
      'Cover Saturday and Sunday morning shifts at a busy neighbourhood cafe. Training on the espresso bar provided. Customer-facing, fast-paced, no late nights.',
    requiredSkills: ['Customer service', 'Barista experience', 'POS'],
    niceToHaveSkills: ['Stock counting'],
    location: 'Kampala',
    workType: 'Gig',
    minYearsExperience: 1,
    startNeed: 'Immediately',
    createdAt: '2026-10-29T07:15:00.000Z',
  },
];

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'cand-amina',
    name: 'Amina Nakato',
    headline: 'Frontend developer',
    skills: ['React', 'TypeScript', 'CSS', 'Git', 'Figma'],
    yearsExperience: 3,
    location: 'Kampala',
    workType: 'Full-time',
    availability: 'Immediately',
    about:
      'Three years building dashboards and customer portals in React and TypeScript. Comfortable turning Figma files into clean, responsive screens.',
    createdAt: '2026-10-29T06:40:00.000Z',
  },
  {
    id: 'cand-brian',
    name: 'Brian Okello',
    headline: 'Full-stack developer',
    skills: ['React', 'TypeScript', 'Node.js', 'SQL', 'Git'],
    yearsExperience: 4,
    location: 'Kampala',
    workType: 'Full-time',
    availability: 'Within 2 weeks',
    about:
      'Full-stack developer who has shipped two internal tools end to end. Strong on the React side, comfortable with APIs and databases.',
    createdAt: '2026-10-29T06:45:00.000Z',
  },
  {
    id: 'cand-sarah',
    name: 'Sarah Namusoke',
    headline: 'UI designer with frontend skills',
    skills: ['Figma', 'CSS', 'HTML', 'Design systems'],
    yearsExperience: 2,
    location: 'Kampala',
    workType: 'Part-time',
    availability: 'Within a month',
    about:
      'Product designer who codes her own components. Looking for part-time design or design-engineering work while finishing a certification.',
    createdAt: '2026-10-29T06:50:00.000Z',
  },
  {
    id: 'cand-daniel',
    name: 'Daniel Mwangi',
    headline: 'Data analyst and dashboard builder',
    skills: ['Python', 'SQL', 'Excel', 'Dashboards'],
    yearsExperience: 2,
    location: 'Nairobi',
    workType: 'Full-time',
    availability: 'Immediately',
    about:
      'Data analyst working remotely for East African SMEs. Builds reporting dashboards and cleans messy operational data.',
    createdAt: '2026-10-29T06:55:00.000Z',
  },
  {
    id: 'cand-grace',
    name: 'Grace Achieng',
    headline: 'Social media and content manager',
    skills: ['Content writing', 'Instagram', 'Canva', 'Analytics', 'Photography'],
    yearsExperience: 3,
    location: 'Kampala',
    workType: 'Part-time',
    availability: 'Immediately',
    about:
      'Runs social channels for two hospitality brands. Writes the copy, shoots the photos, and reports on what the numbers actually say.',
    createdAt: '2026-10-29T07:05:00.000Z',
  },
  {
    id: 'cand-peter',
    name: 'Peter Ssemakula',
    headline: 'Barista and shift supervisor',
    skills: ['Barista experience', 'Customer service', 'POS', 'Stock counting'],
    yearsExperience: 2,
    location: 'Kampala',
    workType: 'Gig',
    availability: 'Within 2 weeks',
    about:
      'Two years on an espresso bar, including weekend supervision. Looking for weekend gigs around Kampala.',
    createdAt: '2026-10-29T07:10:00.000Z',
  },
];

export const SEED_INTERESTS: Interest[] = [
  {
    id: 'int-seed-1',
    opportunityId: 'gig-social',
    candidateId: 'cand-grace',
    createdAt: '2026-10-29T07:20:00.000Z',
  },
];

export function buildSeedState(): AppState {
  return {
    candidates: SEED_CANDIDATES,
    opportunities: SEED_OPPORTUNITIES,
    shortlist: [],
    interests: SEED_INTERESTS,
    activeCandidateId: 'cand-amina',
  };
}

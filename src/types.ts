export type WorkType = 'Full-time' | 'Part-time' | 'Gig';

export type Availability = 'Immediately' | 'Within 2 weeks' | 'Within a month';

export type StartNeed = 'Immediately' | 'Within 2 weeks' | 'Within a month' | 'Flexible';

export interface Candidate {
  id: string;
  name: string;
  headline: string;
  skills: string[];
  yearsExperience: number;
  location: string;
  workType: WorkType;
  availability: Availability;
  about: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  employer: string;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  location: string;
  workType: WorkType;
  minYearsExperience: number;
  startNeed: StartNeed;
  createdAt: string;
}

export interface ShortlistEntry {
  id: string;
  opportunityId: string;
  candidateId: string;
  addedAt: string;
}

export interface Interest {
  id: string;
  opportunityId: string;
  candidateId: string;
  createdAt: string;
}

export interface AppState {
  candidates: Candidate[];
  opportunities: Opportunity[];
  shortlist: ShortlistEntry[];
  interests: Interest[];
  activeCandidateId: string;
}

export const AVAILABILITY_OPTIONS: Availability[] = [
  'Immediately',
  'Within 2 weeks',
  'Within a month',
];

export const START_OPTIONS: StartNeed[] = [
  'Immediately',
  'Within 2 weeks',
  'Within a month',
  'Flexible',
];

export const WORK_TYPES: WorkType[] = ['Full-time', 'Part-time', 'Gig'];

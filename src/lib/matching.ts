import type { Availability, Candidate, Opportunity, StartNeed } from '../types';

export type Band = 'Strong match' | 'Good match' | 'Stretch' | 'Low match';

export interface MatchPart {
  key: 'skills' | 'availability' | 'location' | 'experience';
  points: number;
  max: number;
  ok: boolean;
  text: string;
}

export interface Match {
  candidate: Candidate;
  score: number;
  band: Band;
  suitable: boolean;
  parts: MatchPart[];
  reasons: string[];
  gaps: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

export const WEIGHTS = {
  skills: 60,
  availability: 15,
  location: 15,
  experience: 10,
} as const;

/** A gig needs a candidate at or above this score, with at least half the required skills. */
export const SUITABLE_SCORE = 65;

const AVAILABILITY_DAYS: Record<Availability, number> = {
  Immediately: 0,
  'Within 2 weeks': 14,
  'Within a month': 30,
};

const START_DAYS: Record<StartNeed, number> = {
  Immediately: 0,
  'Within 2 weeks': 14,
  'Within a month': 30,
  Flexible: 3650,
};

const NEED_TEXT: Record<StartNeed, string> = {
  Immediately: 'immediately',
  'Within 2 weeks': 'within 2 weeks',
  'Within a month': 'within a month',
  Flexible: 'on a flexible date',
};

const norm = (value: string) => value.trim().toLowerCase();

const isRemote = (value: string) => norm(value).includes('remote');

export function splitSkills(value: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of value.split(',')) {
    const skill = raw.trim();
    if (!skill) continue;
    const key = norm(skill);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(skill);
  }
  return out;
}

export function bandForScore(score: number): Band {
  if (score >= 80) return 'Strong match';
  if (score >= 65) return 'Good match';
  if (score >= 40) return 'Stretch';
  return 'Low match';
}

export function matchCandidate(candidate: Candidate, opportunity: Opportunity): Match {
  const required = opportunity.requiredSkills.filter((skill) => skill.trim());
  const candidateSkills = candidate.skills.map(norm);

  const matchedSkills = required.filter((skill) => candidateSkills.includes(norm(skill)));
  const missingSkills = required.filter((skill) => !candidateSkills.includes(norm(skill)));

  const skillRatio = required.length === 0 ? 1 : matchedSkills.length / required.length;
  const skillPoints = Math.round(skillRatio * WEIGHTS.skills);

  const skillPart: MatchPart =
    required.length === 0
      ? { key: 'skills', points: WEIGHTS.skills, max: WEIGHTS.skills, ok: true, text: 'No specific skills were required.' }
      : matchedSkills.length === required.length
        ? {
            key: 'skills',
            points: skillPoints,
            max: WEIGHTS.skills,
            ok: true,
            text: `Has all ${required.length} required skills: ${matchedSkills.join(', ')}.`,
          }
        : matchedSkills.length > 0
          ? {
              key: 'skills',
              points: skillPoints,
              max: WEIGHTS.skills,
              ok: false,
              text: `Has ${matchedSkills.length} of ${required.length} required skills: ${matchedSkills.join(', ')}. Missing ${missingSkills.join(', ')}.`,
            }
          : {
              key: 'skills',
              points: 0,
              max: WEIGHTS.skills,
              ok: false,
              text: `None of the required skills (${required.join(', ')}) appear on this profile.`,
            };

  const candidateDays = AVAILABILITY_DAYS[candidate.availability];
  const startDays = START_DAYS[opportunity.startNeed];
  const availabilityFits = candidateDays <= startDays;
  const needText = NEED_TEXT[opportunity.startNeed];
  const availabilityPart: MatchPart = {
    key: 'availability',
    points: availabilityFits ? WEIGHTS.availability : 0,
    max: WEIGHTS.availability,
    ok: availabilityFits,
    text: `Available ${candidate.availability.toLowerCase()}; the gig needs someone ${needText}.`,
  };

  const locationFits = isRemote(candidate.location) || isRemote(opportunity.location) || norm(candidate.location) === norm(opportunity.location);
  const locationText = isRemote(opportunity.location)
    ? `The gig is remote, so being based in ${candidate.location} is fine.`
    : isRemote(candidate.location)
      ? `Works remotely; the gig is based in ${opportunity.location}.`
      : locationFits
        ? `Based in ${candidate.location}, where the gig is.`
        : `Based in ${candidate.location}; the gig is in ${opportunity.location}.`;
  const locationPart: MatchPart = {
    key: 'location',
    points: locationFits ? WEIGHTS.location : 0,
    max: WEIGHTS.location,
    ok: locationFits,
    text: locationText,
  };

  const minYears = opportunity.minYearsExperience;
  const years = candidate.yearsExperience;
  const experienceFits = minYears <= 0 || years >= minYears;
  const experiencePoints =
    minYears <= 0 ? WEIGHTS.experience : Math.min(WEIGHTS.experience, Math.round((years / minYears) * WEIGHTS.experience));
  const experiencePart: MatchPart = {
    key: 'experience',
    points: experiencePoints,
    max: WEIGHTS.experience,
    ok: experienceFits,
    text:
      minYears <= 0
        ? `${years} years experience; no minimum was set.`
        : experienceFits
          ? `${years} years experience, meeting the ${minYears}-year minimum.`
          : `${years} years experience; the gig asks for ${minYears}+.`,
  };

  const parts = [skillPart, availabilityPart, locationPart, experiencePart];
  const score = Math.min(100, parts.reduce((sum, part) => sum + part.points, 0));
  const neededSkills = Math.max(1, Math.ceil(required.length / 2));
  const suitable = score >= SUITABLE_SCORE && matchedSkills.length >= neededSkills;

  return {
    candidate,
    score,
    band: bandForScore(score),
    suitable,
    parts,
    reasons: parts.filter((part) => part.ok).map((part) => part.text),
    gaps: parts.filter((part) => !part.ok).map((part) => part.text),
    matchedSkills,
    missingSkills,
  };
}

export function rankCandidates(candidates: Candidate[], opportunity: Opportunity): Match[] {
  return candidates
    .map((candidate) => matchCandidate(candidate, opportunity))
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name));
}

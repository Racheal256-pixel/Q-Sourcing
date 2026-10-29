import { useSyncExternalStore } from 'react';
import { buildSeedState } from '../data/seed';
import type { AppState, Candidate, Interest, Opportunity, ShortlistEntry } from '../types';

const STORAGE_KEY = 'careerexpo2026.v1';

type Listener = () => void;
const listeners = new Set<Listener>();

function newId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeedState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!Array.isArray(parsed.candidates) || !Array.isArray(parsed.opportunities)) {
      return buildSeedState();
    }
    const seed = buildSeedState();
    const candidates = parsed.candidates.length > 0 ? parsed.candidates : seed.candidates;
    return {
      candidates,
      opportunities: parsed.opportunities,
      shortlist: parsed.shortlist ?? [],
      interests: parsed.interests ?? [],
      activeCandidateId: candidates.some((c) => c.id === parsed.activeCandidateId)
        ? (parsed.activeCandidateId as string)
        : candidates[0].id,
    };
  } catch {
    return buildSeedState();
  }
}

let state: AppState = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private mode; the demo still works in memory.
  }
}

function setState(next: AppState) {
  state = next;
  persist();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): AppState {
  return state;
}

/** Replaces the whole workspace, used by the optional Firestore sync. */
export function replaceState(next: AppState) {
  if (!Array.isArray(next.candidates) || !Array.isArray(next.opportunities)) return;
  setState({
    ...next,
    shortlist: Array.isArray(next.shortlist) ? next.shortlist : [],
    interests: Array.isArray(next.interests) ? next.interests : [],
  });
}

export function useApp(): AppState {
  return useSyncExternalStore(subscribe, getState, getState);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        state = JSON.parse(event.newValue) as AppState;
        listeners.forEach((listener) => listener());
      } catch {
        // Ignore malformed writes from other tabs.
      }
    }
  });
}

export function addOpportunity(input: Omit<Opportunity, 'id' | 'createdAt'>): string {
  const opportunity: Opportunity = {
    ...input,
    id: newId('gig'),
    createdAt: new Date().toISOString(),
  };
  setState({ ...state, opportunities: [opportunity, ...state.opportunities] });
  return opportunity.id;
}

export function updateOpportunity(id: string, input: Omit<Opportunity, 'id' | 'createdAt'>) {
  setState({
    ...state,
    opportunities: state.opportunities.map((opportunity) =>
      opportunity.id === id ? { ...opportunity, ...input } : opportunity,
    ),
  });
}

export function removeOpportunity(id: string) {
  setState({
    ...state,
    opportunities: state.opportunities.filter((opportunity) => opportunity.id !== id),
    shortlist: state.shortlist.filter((entry) => entry.opportunityId !== id),
    interests: state.interests.filter((entry) => entry.opportunityId !== id),
  });
}

export function addCandidate(input: Omit<Candidate, 'id' | 'createdAt'>): string {
  const candidate: Candidate = {
    ...input,
    id: newId('cand'),
    createdAt: new Date().toISOString(),
  };
  setState({
    ...state,
    candidates: [candidate, ...state.candidates],
    activeCandidateId: candidate.id,
  });
  return candidate.id;
}

export function updateCandidate(id: string, input: Omit<Candidate, 'id' | 'createdAt'>) {
  setState({
    ...state,
    candidates: state.candidates.map((candidate) =>
      candidate.id === id ? { ...candidate, ...input } : candidate,
    ),
  });
}

export function setActiveCandidate(id: string) {
  if (!state.candidates.some((candidate) => candidate.id === id)) return;
  setState({ ...state, activeCandidateId: id });
}

export function isShortlisted(opportunityId: string, candidateId: string, appState: AppState = state): boolean {
  return appState.shortlist.some(
    (entry) => entry.opportunityId === opportunityId && entry.candidateId === candidateId,
  );
}

export function toggleShortlist(opportunityId: string, candidateId: string) {
  const exists = isShortlisted(opportunityId, candidateId);
  if (exists) {
    setState({
      ...state,
      shortlist: state.shortlist.filter(
        (entry) => !(entry.opportunityId === opportunityId && entry.candidateId === candidateId),
      ),
    });
    return;
  }
  const entry: ShortlistEntry = {
    id: newId('short'),
    opportunityId,
    candidateId,
    addedAt: new Date().toISOString(),
  };
  setState({ ...state, shortlist: [...state.shortlist, entry] });
}

export function getInterest(opportunityId: string, candidateId: string, appState: AppState = state): Interest | undefined {
  return appState.interests.find(
    (entry) => entry.opportunityId === opportunityId && entry.candidateId === candidateId,
  );
}

export function expressInterest(opportunityId: string, candidateId: string) {
  if (getInterest(opportunityId, candidateId)) return;
  const interest: Interest = {
    id: newId('int'),
    opportunityId,
    candidateId,
    createdAt: new Date().toISOString(),
  };
  setState({ ...state, interests: [...state.interests, interest] });
}

export function withdrawInterest(opportunityId: string, candidateId: string) {
  setState({
    ...state,
    interests: state.interests.filter(
      (entry) => !(entry.opportunityId === opportunityId && entry.candidateId === candidateId),
    ),
  });
}

export function resetDemo() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  setState(buildSeedState());
}

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

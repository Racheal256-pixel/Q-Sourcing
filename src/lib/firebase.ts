import type { FirebaseOptions } from 'firebase/app';
import { getState, replaceState, subscribe } from './store';
import type { AppState } from '../types';

const CONFIG_KEY = 'careerexpo2026.firebaseConfig';
const COLLECTION = 'workspaces';
const DOC_ID = 'career-expo-demo';

export type CloudStatus = 'off' | 'on' | 'error';

export function getFirebaseOptions(): FirebaseOptions | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FirebaseOptions;
    return parsed.apiKey && parsed.projectId ? parsed : null;
  } catch {
    return null;
  }
}

export function saveFirebaseConfig(config: FirebaseOptions) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

let started = false;

/**
 * Optional Firestore mirror. The app is local-first; this only runs when a
 * Firebase web config has been saved in the browser (see README).
 */
export async function startCloudSync(): Promise<CloudStatus> {
  if (started) return 'on';
  const options = getFirebaseOptions();
  if (!options) return 'off';

  try {
    const [{ initializeApp, getApps }, { getFirestore, doc, onSnapshot, setDoc }] = await Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
    ]);

    const app = getApps()[0] ?? initializeApp(options);
    const db = getFirestore(app);
    const ref = doc(db, COLLECTION, DOC_ID);
    let applyingRemote = false;

    onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        void setDoc(ref, getState()).catch(() => undefined);
        return;
      }
      const data = snapshot.data() as Partial<AppState>;
      if (!Array.isArray(data.candidates) || !Array.isArray(data.opportunities)) return;
      applyingRemote = true;
      replaceState(data as AppState);
      applyingRemote = false;
    });

    subscribe(() => {
      if (applyingRemote) return;
      void setDoc(ref, getState()).catch(() => undefined);
    });

    started = true;
    return 'on';
  } catch (error) {
    console.warn('Firebase sync could not start; staying local.', error);
    return 'error';
  }
}

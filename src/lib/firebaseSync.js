import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { buildStudySnapshot } from "./studyData";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

function hasFirebaseConfig() {
  return Object.values(config).every(Boolean);
}

export function isFirebaseConfigured() {
  return hasFirebaseConfig();
}

function getFirebaseApp() {
  if (!hasFirebaseConfig()) return null;
  return getApps()[0] || initializeApp(config);
}

export async function syncStudyStateToFirebase(studyState) {
  const app = getFirebaseApp();
  if (!app) {
    return { synced: false, reason: "missing_config" };
  }

  const database = getDatabase(app);
  const snapshot = buildStudySnapshot(studyState);
  await set(ref(database, "studySnapshots/latest"), snapshot);
  return { synced: true };
}

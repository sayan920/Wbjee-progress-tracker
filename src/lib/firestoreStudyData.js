import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const STUDY_SECTION_NAMES = [
  "chapters",
  "practiceLogs",
  "mistakes",
  "coachReport",
  "journeyFeed",
  "settings",
  "reminders",
  "statistics"
];

function profileRef(uid) {
  return doc(db, "users", uid, "profile", "profile");
}

function studyRef(uid, section) {
  return doc(collection(doc(db, "users", uid), "study"), section);
}

export async function ensureUserProfile(uid, user) {
  const now = new Date().toISOString();
  const snapshot = await getDoc(profileRef(uid));
  const existing = snapshot.exists() ? snapshot.data() : {};

  await setDoc(
    profileRef(uid),
    {
      uid,
      email: user?.email || existing.email || null,
      displayName: user?.displayName || existing.displayName || null,
      photoURL: user?.photoURL || existing.photoURL || null,
      createdAt: existing.createdAt || now,
      updatedAt: now
    },
    { merge: true }
  );
}

export async function readRemoteStudyData(uid) {
  const studyData = {};
  const metadata = {};
  let hasRemoteData = false;

  await Promise.all(
    STUDY_SECTION_NAMES.map(async (section) => {
      const snapshot = await getDoc(studyRef(uid, section));

      if (!snapshot.exists()) return;

      const payload = snapshot.data() || {};
      if (Object.hasOwn(payload, "data")) {
        studyData[section] = payload.data;
        metadata[section] = payload.updatedAt || null;
        hasRemoteData = true;
      }
    })
  );

  return {
    studyData,
    metadata,
    hasRemoteData
  };
}

export async function writeRemoteStudyData(uid, studyData, metadata = {}) {
  const fallbackTimestamp = new Date().toISOString();

  await Promise.all(
    STUDY_SECTION_NAMES.map((section) =>
      setDoc(
        studyRef(uid, section),
        {
          data: Object.hasOwn(studyData, section) ? studyData[section] : null,
          updatedAt: metadata[section] || fallbackTimestamp
        },
        { merge: true }
      )
    )
  );
}

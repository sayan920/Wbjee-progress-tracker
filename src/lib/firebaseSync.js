import { auth, isFirebaseConfigured } from "./firebase";
import { writeRemoteStudyData } from "./firestoreStudyData";
import { readLocalStudyData, readStudyMetadata } from "./studyData";

export { isFirebaseConfigured } from "./firebase";

export async function syncStudyStateToFirebase(studyState) {
  if (!isFirebaseConfigured()) {
    return { synced: false, reason: "missing_config" };
  }

  if (!auth.currentUser?.uid) {
    return { synced: false, reason: "missing_user" };
  }

  const localStudyData = readLocalStudyData();
  const localMetadata = readStudyMetadata();

  if (studyState?.logs) localStudyData.practiceLogs = studyState.logs;
  if (studyState?.chapters) localStudyData.chapters = studyState.chapters;
  if (studyState?.mistakes) localStudyData.mistakes = studyState.mistakes;

  await writeRemoteStudyData(auth.currentUser.uid, localStudyData, localMetadata);
  return { synced: true };
}

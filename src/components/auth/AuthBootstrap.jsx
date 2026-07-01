import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createEmptyStudyData,
  getLatestLocalTimestamp,
  getLatestMetadataTimestamp,
  hasMeaningfulStudyData,
  readLocalStudyData,
  readStudyMetadata,
  writeLocalStudyData
} from "../../lib/studyData";
import {
  ensureUserProfile,
  readRemoteStudyData,
  writeRemoteStudyData
} from "../../lib/firestoreStudyData";

export default function AuthBootstrap({ children }) {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!user?.uid) {
        if (active) setReady(true);
        return;
      }

      const localStudyData = readLocalStudyData();
      const localMetadata = readStudyMetadata();
      const localHasData = hasMeaningfulStudyData(localStudyData);
      const localLatestTimestamp = getLatestLocalTimestamp(localMetadata);

      await ensureUserProfile(user.uid, user);

      const remote = await readRemoteStudyData(user.uid);
      const remoteLatestTimestamp = getLatestMetadataTimestamp(remote.metadata);

      if (!remote.hasRemoteData) {
        if (localHasData) {
          await writeRemoteStudyData(user.uid, localStudyData, localMetadata);
        } else {
          const defaults = createEmptyStudyData();
          writeLocalStudyData(defaults, { silent: true });
          await writeRemoteStudyData(user.uid, defaults, readStudyMetadata());
        }
      } else if (!localHasData || remoteLatestTimestamp > localLatestTimestamp) {
        writeLocalStudyData(remote.studyData, {
          metadata: remote.metadata,
          silent: true
        });
      } else if (localLatestTimestamp > remoteLatestTimestamp) {
        await writeRemoteStudyData(user.uid, localStudyData, localMetadata);
      }

      window.dispatchEvent(new Event("studyDataUpdated"));

      if (active) {
        setReady(true);
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [user]);

  if (!ready) {
    return <div style={loadingScreen}>Loading your StudySpace data...</div>;
  }

  return children;
}

const loadingScreen = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#050816",
  color: "#f8fafc",
  fontSize: "18px",
  fontWeight: 600
};

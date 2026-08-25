"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ClassroomPlaybackContextValue = {
  recordingEmbedUrl: string | null;
  playRecording: (embedUrl: string) => void;
  clearRecording: () => void;
};

const ClassroomPlaybackContext =
  createContext<ClassroomPlaybackContextValue | null>(null);

export function ClassroomPlaybackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [recordingEmbedUrl, setRecordingEmbedUrl] = useState<string | null>(
    null,
  );

  const playRecording = useCallback((embedUrl: string) => {
    setRecordingEmbedUrl(embedUrl);
  }, []);

  const clearRecording = useCallback(() => {
    setRecordingEmbedUrl(null);
  }, []);

  const value = useMemo(
    () => ({
      recordingEmbedUrl,
      playRecording,
      clearRecording,
    }),
    [recordingEmbedUrl, playRecording, clearRecording],
  );

  return (
    <ClassroomPlaybackContext.Provider value={value}>
      {children}
    </ClassroomPlaybackContext.Provider>
  );
}

export function useClassroomPlayback() {
  const context = useContext(ClassroomPlaybackContext);
  if (!context) {
    throw new Error(
      "useClassroomPlayback must be used within ClassroomPlaybackProvider",
    );
  }
  return context;
}

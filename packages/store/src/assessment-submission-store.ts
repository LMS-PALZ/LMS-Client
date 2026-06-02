import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SubmissionAttachmentKind = "file" | "url";

export interface SubmissionAttachment {
  id: string;
  kind: SubmissionAttachmentKind;
  name: string;
  sizeBytes?: number;
  url?: string;
}

export interface AssignmentSubmissionState {
  comments: string;
  attachments: SubmissionAttachment[];
  submittedAt: string | null;
  isSubmitted: boolean;
}

interface AssessmentSubmissionStore {
  byAssignment: Record<string, AssignmentSubmissionState>;
  uploadProgress: Record<string, number | null>;

  getSubmission: (assignmentId: string) => AssignmentSubmissionState;
  setComments: (assignmentId: string, comments: string) => void;
  addAttachment: (
    assignmentId: string,
    attachment: SubmissionAttachment,
  ) => void;
  removeAttachment: (assignmentId: string, attachmentId: string) => void;
  setUploadProgress: (assignmentId: string, progress: number | null) => void;
  submitAssignment: (assignmentId: string) => void;
  undoSubmission: (assignmentId: string) => void;
  resetAssignment: (assignmentId: string) => void;
}

/** Stable fallback — must be reused so Zustand selectors do not loop in React 19. */
export const EMPTY_SUBMISSION: AssignmentSubmissionState = {
  comments: "",
  attachments: [],
  submittedAt: null,
  isSubmitted: false,
};

function submissionFor(
  byAssignment: Record<string, AssignmentSubmissionState>,
  assignmentId: string,
): AssignmentSubmissionState {
  return byAssignment[assignmentId] ?? EMPTY_SUBMISSION;
}

export const useAssessmentSubmissionStore = create<AssessmentSubmissionStore>()(
  persist(
    (set, get) => ({
      byAssignment: {},
      uploadProgress: {},

      getSubmission: (assignmentId) =>
        submissionFor(get().byAssignment, assignmentId),

      setComments: (assignmentId, comments) =>
        set((state) => ({
          byAssignment: {
            ...state.byAssignment,
            [assignmentId]: {
              ...submissionFor(state.byAssignment, assignmentId),
              comments,
            },
          },
        })),

      addAttachment: (assignmentId, attachment) =>
        set((state) => {
          const current = submissionFor(state.byAssignment, assignmentId);
          if (current.attachments.some((a) => a.id === attachment.id)) {
            return state;
          }
          return {
            byAssignment: {
              ...state.byAssignment,
              [assignmentId]: {
                ...current,
                attachments: [...current.attachments, attachment],
              },
            },
          };
        }),

      removeAttachment: (assignmentId, attachmentId) =>
        set((state) => {
          const current = submissionFor(state.byAssignment, assignmentId);
          return {
            byAssignment: {
              ...state.byAssignment,
              [assignmentId]: {
                ...current,
                attachments: current.attachments.filter(
                  (a) => a.id !== attachmentId,
                ),
              },
            },
          };
        }),

      setUploadProgress: (assignmentId, progress) =>
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [assignmentId]: progress,
          },
        })),

      submitAssignment: (assignmentId) =>
        set((state) => {
          const current = submissionFor(state.byAssignment, assignmentId);
          return {
            byAssignment: {
              ...state.byAssignment,
              [assignmentId]: {
                ...current,
                isSubmitted: true,
                submittedAt: new Date().toISOString(),
              },
            },
          };
        }),

      undoSubmission: (assignmentId) =>
        set((state) => {
          const current = submissionFor(state.byAssignment, assignmentId);
          return {
            byAssignment: {
              ...state.byAssignment,
              [assignmentId]: {
                ...current,
                isSubmitted: false,
                submittedAt: null,
              },
            },
          };
        }),

      resetAssignment: (assignmentId) =>
        set((state) => {
          const next = { ...state.byAssignment };
          delete next[assignmentId];
          const nextProgress = { ...state.uploadProgress };
          delete nextProgress[assignmentId];
          return { byAssignment: next, uploadProgress: nextProgress };
        }),
    }),
    {
      name: "assessment-submissions",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ byAssignment: state.byAssignment }),
    },
  ),
);

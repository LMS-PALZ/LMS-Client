export interface SubmissionPayload {
  assignmentId: string;
  kind: "file" | "link" | "text";
  value: string | File;
}

export const submissionsApi = {
  submit: async (_payload: SubmissionPayload): Promise<{ ok: boolean }> => {
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true };
  },
};

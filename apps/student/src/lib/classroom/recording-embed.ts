export { toVideoEmbedUrl } from "@ssu/utils";

export type ClassroomSessionOpenMode = "watch" | "join" | "view";

export function classroomSessionHref(options: {
  lessonId: string;
  programId?: string;
  recordingUrl?: string | null;
  /** watch = play recording; join = live Zoom; view = detail/resources only */
  mode?: ClassroomSessionOpenMode;
}): string {
  const params = new URLSearchParams();
  if (options.programId) params.set("programId", options.programId);

  const mode =
    options.mode ?? (options.recordingUrl?.trim() ? "watch" : "join");

  if (mode === "watch") params.set("watch", "1");
  else if (mode === "join") params.set("join", "1");

  const query = params.toString();
  return `/classroom/${options.lessonId}${query ? `?${query}` : ""}`;
}

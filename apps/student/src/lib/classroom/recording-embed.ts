export { toVideoEmbedUrl } from "@ssu/utils";

export function classroomSessionHref(options: {
  lessonId: string;
  programId?: string;
  recordingUrl?: string | null;
}): string {
  const params = new URLSearchParams();
  if (options.programId) params.set("programId", options.programId);
  if (options.recordingUrl?.trim()) params.set("watch", "1");
  else params.set("join", "1");
  const query = params.toString();
  return `/classroom/${options.lessonId}${query ? `?${query}` : ""}`;
}

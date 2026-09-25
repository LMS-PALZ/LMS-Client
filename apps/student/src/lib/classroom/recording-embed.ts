export function toVideoEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) return trimmed;
      const fromQuery = parsed.searchParams.get("v");
      const fromPath = parsed.pathname.split("/").filter(Boolean).at(-1);
      const id = fromQuery || fromPath;
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : trimmed;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

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

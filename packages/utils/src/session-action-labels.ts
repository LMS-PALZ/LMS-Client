/** Canonical student/admin CTAs for live vs recorded classes. */
export const JOIN_LIVE_CLASS_LABEL = "Join live class";
export const WATCH_RECORDED_CLASS_LABEL = "Watch recorded class";

export function sessionActionLabel(hasRecording: boolean): string {
  return hasRecording ? WATCH_RECORDED_CLASS_LABEL : JOIN_LIVE_CLASS_LABEL;
}

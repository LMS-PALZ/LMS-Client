/**
 * A live class runs longer than the access token lives, so the token expires
 * mid-class and the expiry handler signs the user out, dropping them from the
 * meeting. Zoom holds its own meeting credentials, so the class itself survives
 * an expired token: only the sign-out has to wait until the class is over.
 */

/** Bounds the hold in case a class never reports that it ended. */
const MAX_HOLD_MS = 3 * 60 * 60 * 1000;

let activeSessions = 0;
let pendingSignOut: (() => void) | null = null;
let releaseTimer: ReturnType<typeof setTimeout> | null = null;

function runPendingSignOut() {
  const signOut = pendingSignOut;
  pendingSignOut = null;
  if (signOut) signOut();
}

export function isLiveSessionActive(): boolean {
  return activeSessions > 0;
}

export function markLiveSessionStarted(): void {
  activeSessions += 1;
  if (releaseTimer) clearTimeout(releaseTimer);
  releaseTimer = setTimeout(() => {
    releaseTimer = null;
    runPendingSignOut();
  }, MAX_HOLD_MS);
}

export function markLiveSessionEnded(): void {
  activeSessions = Math.max(0, activeSessions - 1);
  if (activeSessions > 0) return;

  if (releaseTimer) {
    clearTimeout(releaseTimer);
    releaseTimer = null;
  }
  runPendingSignOut();
}

/**
 * Returns true when the sign-out was held back, in which case it runs as soon
 * as the last live session ends.
 */
export function holdSignOutDuringLiveSession(signOut: () => void): boolean {
  if (!isLiveSessionActive()) return false;
  pendingSignOut = signOut;
  return true;
}

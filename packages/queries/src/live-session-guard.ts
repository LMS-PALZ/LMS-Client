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

export function holdSignOutDuringLiveSession(signOut: () => void): boolean {
  if (!isLiveSessionActive()) return false;
  pendingSignOut = signOut;
  return true;
}

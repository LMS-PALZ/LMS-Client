#!/usr/bin/env bash
set -euo pipefail

# Prefer explicit NETLIFY_APP (Site configuration → Environment variables).
# Falls back to NETLIFY_SITE_NAME for known site names.

if [[ -z "${NETLIFY_APP:-}" ]]; then
  case "${NETLIFY_SITE_NAME:-}" in
    adminstg|*admin*) NETLIFY_APP=admin ;;
    ssuhubstg|ssustaging|*student*) NETLIFY_APP=student ;;
  esac
fi

if [[ -z "${NETLIFY_APP:-}" ]]; then
  echo "ERROR: Could not detect app to build."
  echo "Set NETLIFY_APP=student or NETLIFY_APP=admin in this Netlify site's environment variables."
  echo "NETLIFY_SITE_NAME=${NETLIFY_SITE_NAME:-<unset>}"
  exit 1
fi

echo "Building @ssu/${NETLIFY_APP} (NETLIFY_SITE_NAME=${NETLIFY_SITE_NAME:-<unset>})"

case "$NETLIFY_APP" in
  student)
    npm run build -w @ssu/student
    ;;
  admin)
    npm run build -w @ssu/admin
    ;;
  *)
    echo "ERROR: NETLIFY_APP must be 'student' or 'admin' (got: $NETLIFY_APP)"
    exit 1
    ;;
esac

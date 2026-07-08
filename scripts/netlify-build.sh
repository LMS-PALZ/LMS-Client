#!/usr/bin/env bash
set -euo pipefail

# Prefer explicit NETLIFY_APP (Site configuration → Environment variables).
# Otherwise detect from Netlify read-only vars: SITE_NAME, URL.

detect_app_from_name() {
  local value="${1:-}"
  case "$value" in
    adminstg|*admin*) echo admin ;;
    ssuhubstg|ssustaging|*student*) echo student ;;
    *) echo "" ;;
  esac
}

if [[ -z "${NETLIFY_APP:-}" ]]; then
  NETLIFY_APP="$(detect_app_from_name "${SITE_NAME:-}")"
fi

if [[ -z "${NETLIFY_APP:-}" ]]; then
  NETLIFY_APP="$(detect_app_from_name "${URL:-}")"
fi

if [[ -z "${NETLIFY_APP:-}" ]]; then
  NETLIFY_APP="$(detect_app_from_name "${DEPLOY_URL:-}")"
fi

if [[ -z "${NETLIFY_APP:-}" ]]; then
  echo "ERROR: Could not detect app to build."
  echo "Set NETLIFY_APP=student or NETLIFY_APP=admin in Site configuration → Environment variables."
  echo "SITE_NAME=${SITE_NAME:-<unset>}"
  echo "URL=${URL:-<unset>}"
  exit 1
fi

echo "Building @ssu/${NETLIFY_APP} (SITE_NAME=${SITE_NAME:-<unset>})"

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

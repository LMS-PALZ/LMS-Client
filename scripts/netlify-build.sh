#!/usr/bin/env bash
set -euo pipefail

# Set on each Netlify site (Site configuration → Environment variables):
#   Student site → NETLIFY_APP=student
#   Admin site   → NETLIFY_APP=admin

if [[ -z "${NETLIFY_APP:-}" ]]; then
  echo "ERROR: Set NETLIFY_APP=student or NETLIFY_APP=admin in this Netlify site's environment variables."
  exit 1
fi

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

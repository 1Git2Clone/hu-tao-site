#!/usr/bin/env bash
# Fails when the Netlify token expires within a week, or no longer works.
# Netlify's API doesn't report a token's expiry, so it is kept by hand in the
# NETLIFY_TOKEN_EXPIRES repo variable (YYYY-MM-DD). After rotating the token:
#   gh secret set NETLIFY_AUTH_TOKEN
#   gh variable set NETLIFY_TOKEN_EXPIRES --body YYYY-MM-DD
set -euo pipefail

: "${NETLIFY_TOKEN_EXPIRES:?set the NETLIFY_TOKEN_EXPIRES repo variable}"

days_left=$((($(date -d "$NETLIFY_TOKEN_EXPIRES" +%s) - $(date -d "$(date +%F)" +%s)) / 86400))
echo "Netlify token expires $NETLIFY_TOKEN_EXPIRES, in $days_left days."
if [ "$days_left" -lt 7 ]; then
  echo "::error::Netlify token expires in $days_left days. Rotate it."
  exit 1
fi

# Fork PRs get no secrets; the date is all there is to check then.
if [ -n "${NETLIFY_AUTH_TOKEN:-}" ]; then
  curl -fsS -o /dev/null -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
    https://api.netlify.com/api/v1/user ||
    {
      echo "::error::Netlify rejected the token. Rotate it."
      exit 1
    }
fi

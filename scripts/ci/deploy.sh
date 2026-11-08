#!/usr/bin/env bash
# Builds and deploys to Netlify: production with no argument, otherwise a
# preview aliased to `pr-<number>`. Prints the deployed URL, and also writes it
# to $GITHUB_OUTPUT when run in Actions. Needs NETLIFY_AUTH_TOKEN and
# NETLIFY_SITE_ID in the environment.
set -euo pipefail

pr=${1:-}
netlify=(npx --yes netlify-cli@27.15.0)

# Built separately so its logs stay out of the deploy's JSON on stdout,
# and `--no-build` so `deploy` uploads that build instead of building again.
if [ -z "$pr" ]; then
  "${netlify[@]}" build --context production
else
  "${netlify[@]}" build --context deploy-preview
fi

# Reports come from this workflow's measured production builds. Generate them
# after the site build, so report files never change the measured bundles.
if [ -n "${PERFORMANCE_REPORTS:-}" ]; then
  node scripts/ci/performance-report.ts "$PERFORMANCE_REPORTS" build/benchmarks
fi

if [ -z "$pr" ]; then
  "${netlify[@]}" deploy --no-build --prod --json >/dev/null
  url=https://hu-tao.dev
else
  url=$("${netlify[@]}" deploy --no-build --alias="pr-$pr" --json | jq -r .deploy_url)
fi

echo "$url"
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "url=$url" >>"$GITHUB_OUTPUT"
fi

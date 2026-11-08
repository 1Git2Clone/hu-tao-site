#!/usr/bin/env bash
# Checks out the commit named in performance/baseline.json into <dir>, with its
# own install, and builds it when asked. The benchmark and Lighthouse jobs
# compare the pushed code with it on the same runner.
#   scripts/ci/performance-baseline.sh <dir> [build]
set -euo pipefail

dir=$1
commit=$(node -p 'require("./performance/baseline.json").commit')
# Checkout fetches one commit; the baseline is usually older.
if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
  git fetch --quiet --depth=1 origin "$commit"
fi
git worktree add --quiet --detach "$dir" "$commit"
cd "$dir"
pnpm install --frozen-lockfile
if [[ ${2:-} == build ]]; then
  pnpm run build
fi

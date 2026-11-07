#!/usr/bin/env bash
# Runs svelte-check and pnpm test on each commit that a push would send, in its
# own worktree. CI checks only the branch tip, and a commit made from part of a file can fail on its own
# while the working tree and the tip pass.
#
# The pre-push hook in .pre-commit-config.yaml runs this. pre-commit gives the
# pushed range as PRE_COMMIT_FROM_REF and PRE_COMMIT_TO_REF. By hand, pass a
# range: scripts/checks/commits.sh origin/main..HEAD
# Skip it for one push with `git push --no-verify`.
set -euo pipefail

# Git runs hooks outside the dev shell, where pnpm is not on the path.
if ! command -v pnpm >/dev/null; then
  exec nix develop "$(git rev-parse --show-toplevel)" -c "$0" "$@"
fi

if [[ -n "${PRE_COMMIT_TO_REF:-}" ]]; then
  # No from ref means the push starts a new history, so check all of it.
  range="${PRE_COMMIT_FROM_REF:+$PRE_COMMIT_FROM_REF..}$PRE_COMMIT_TO_REF"
elif (($# == 1)); then
  range="$1"
else
  echo "usage: $0 <range>, for example origin/main..HEAD" >&2
  exit 2
fi
mapfile -t commits < <(git rev-list --reverse "$range")

if ((${#commits[@]} == 0)); then
  exit 0
fi

root="$(git rev-parse --show-toplevel)"
tree="$(mktemp -d)"
trap 'git worktree remove --force "$tree" >/dev/null 2>&1 || rm -rf "$tree"' EXIT
git worktree add --quiet --detach "$tree" "${commits[0]}"
ln -s "$root/node_modules" "$tree/node_modules"

failed=0
for commit in "${commits[@]}"; do
  git -C "$tree" checkout --quiet "$commit"
  if (cd "$tree" && pnpm run --silent check && pnpm run --silent test) >/dev/null 2>&1; then
    echo "ok    $(git log --oneline -1 "$commit")"
  else
    echo "FAIL  $(git log --oneline -1 "$commit")" >&2
    failed=1
  fi
done

if ((failed)); then
  echo "Some commits fail svelte-check or pnpm test on their own. Fix them, or push with --no-verify." >&2
  exit 1
fi

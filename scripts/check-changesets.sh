#!/usr/bin/env bash
# Ensures PRs that change packages/ (published npm code) include a release changeset (.changeset/*.md, not README.md).
# Option A: packages only — apps/ (e.g. Storybook) changes do not require a changeset.
# Usage: from repo root, after checkout:
#   BASE_REF=dev HEAD_REF=HEAD ./scripts/check-changesets.sh
# Or in GitHub Actions: BASE_REF and HEAD_REF are set from the PR.

set -e

BASE_REF="${BASE_REF:-$GITHUB_BASE_REF}"
HEAD_REF="${HEAD_REF:-HEAD}"

if [ -z "$BASE_REF" ]; then
  echo "::error::BASE_REF or GITHUB_BASE_REF is required."
  exit 1
fi

# Fetch base so we can diff (full history for merge base if needed)
git fetch origin "$BASE_REF" --depth=1 2>/dev/null || git fetch origin "$BASE_REF"

CHANGED=$(git diff --name-only "origin/$BASE_REF" "$HEAD_REF" 2>/dev/null || true)

if [ -z "$CHANGED" ]; then
  echo "No changed files to check."
  exit 0
fi

# Check if any published package changed (packages/ only; apps/ excluded)
RELEASABLE_CHANGED=$(echo "$CHANGED" | grep -E '^packages/[^/]+/' | grep -vE '/dist/|/node_modules/' || true)

if [ -z "$RELEASABLE_CHANGED" ]; then
  echo "No changes in packages/ — changeset not required."
  exit 0
fi

# Require at least one .changeset/*.md file that is not README.md
CHANGESET_FILES=$(echo "$CHANGED" | grep '^\.changeset/' | grep '\.md$' || true)
NON_README_CHANGESETS=$(echo "$CHANGESET_FILES" | grep -v 'README\.md$' || true)

if [ -z "$NON_README_CHANGESETS" ]; then
  echo "::error::Changes to packages/ require a release changeset."
  echo "Run: pnpm changeset"
  echo "Then add the new .changeset/*.md file to this PR."
  exit 1
fi

echo "Release changeset(s) found — OK."

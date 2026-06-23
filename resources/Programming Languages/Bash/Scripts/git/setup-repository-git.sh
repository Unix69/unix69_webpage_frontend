#!/bin/bash
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $0 <repo-name> <url>"
  exit 1
fi

REPO_NAME="$1"
REMOTE_URL="$2"

mkdir "$REPO_NAME"
cd "$REPO_NAME"

git init
git branch -M main
git remote add origin "$REMOTE_URL"

echo "# $REPO_NAME" > README.md
git add README.md
git commit -m "Initial commit"
git push -u origin main

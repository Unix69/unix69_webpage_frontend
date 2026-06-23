#!/bin/bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <branch-name>"
  exit 1
fi

BRANCH="$1"
git checkout "$BRANCH"

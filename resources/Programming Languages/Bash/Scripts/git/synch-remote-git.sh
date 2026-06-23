#!/bin/bash
set -euo pipefail

read -rp "Enter the branch name: " BRANCH

git pull origin "$BRANCH" --rebase
git push origin "$BRANCH"

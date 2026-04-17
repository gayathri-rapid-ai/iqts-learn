#!/usr/bin/env bash
set -euo pipefail

# Keep this script on EC2 and run it manually for deployments.
# First run: clones repo. Next runs: pulls latest code.

REPO_URL="git@github.com:gayathri-rapid-ai/Programming.git"
BRANCH="main"
APP_DIR="$HOME/next-exec-app"
APP_NAME="next-exec-app"
APP_PORT="3000"

for cmd in git node npm; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: '$cmd' is not installed."
    exit 1
  fi
done

if [[ "$REPO_URL" == https://github.com/* ]]; then
  echo "Error: REPO_URL is HTTPS and will prompt for GitHub username/token."
  echo "Use SSH format instead: git@github.com:<owner>/<repo>.git"
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found. Installing globally..."
  npm install -g pm2
fi

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "==> Cloning repository"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  echo "==> Pulling latest changes"
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" pull origin "$BRANCH"
fi

if [[ -f "$APP_DIR/package.json" ]]; then
  RUN_DIR="$APP_DIR"
elif [[ -f "$APP_DIR/next-exec-app/package.json" ]]; then
  RUN_DIR="$APP_DIR/next-exec-app"
else
  echo "Error: package.json not found in $APP_DIR or $APP_DIR/next-exec-app"
  exit 1
fi

cd "$RUN_DIR"

echo "==> Installing dependencies"
npm ci --no-audit --no-fund --progress=false

echo "==> Building app"
npm run build

if [[ ! -d "$RUN_DIR/.next" ]]; then
  echo "Error: build finished but .next directory not found in $RUN_DIR"
  exit 1
fi

echo "==> Starting Next app with PM2"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 delete "$APP_NAME"
fi

pm2 start "npx next start -H 0.0.0.0 -p $APP_PORT" --name "$APP_NAME" --cwd "$RUN_DIR"
pm2 save

echo "Deployment successful for '$APP_NAME' on branch '$BRANCH'."

#!/usr/bin/env bash
# ==============================================================================
# Tooly.tn - Zero-Downtime VPS Update Script
# ==============================================================================
# Pulls latest commits, migrates database, rebuilds, and reloads PM2
# Usage: sudo bash scripts/update-vps.sh
# ==============================================================================

set -euo pipefail

APP_DIR="/var/www/tooly"
if [[ -f "./ecosystem.config.js" && -f "./package.json" ]]; then
    APP_DIR="$(pwd)"
fi

cd "$APP_DIR"

echo ">>> 1/5 Pulling latest code from GitHub..."
git pull

echo ">>> 2/5 Installing updated dependencies..."
npm install --no-audit

echo ">>> 3/5 Building shared packages (@tooly/contracts)..."
npm run build:packages || (cd "${APP_DIR}/packages/contracts" && npx tsc)

echo ">>> 4/5 Running database migrations..."
npx prisma generate --schema=apps/api/prisma/schema.prisma
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

echo ">>> 5/5 Building production packages & applications..."
npm run build:api
npm run build:web

echo ">>> 5/5 Reloading PM2 services with zero downtime..."
pm2 reload ecosystem.config.js --update-env
pm2 save

if command -v nginx &>/dev/null; then
    nginx -t && systemctl reload nginx
fi

echo "=========================================================="
echo " Tooly.tn successfully updated!"
echo "=========================================================="
pm2 status


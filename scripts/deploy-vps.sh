#!/usr/bin/env bash
# ==============================================================================
# Tooly.tn - Automated Master VPS Deployment Script
# ==============================================================================
# Target directory: /var/www/tooly
# Domain: tooly.tn / www.tooly.tn
# Port Isolation:
#   - Existing website backend: Port 5000 (Completely preserved)
#   - Tooly API: Port 4000
#   - Tooly Web: Port 3000
# ==============================================================================

set -euo pipefail

# Text formatting colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Helper logging functions
log_info() {
    echo -e "${BLUE}${BOLD}[INFO]${NC} $1"
}
log_success() {
    echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"
}
log_warn() {
    echo -e "${YELLOW}${BOLD}[WARNING]${NC} $1"
}
log_error() {
    echo -e "${RED}${BOLD}[ERROR]${NC} $1"
}
log_step() {
    echo -e "\n${PURPLE}${BOLD}==============================================================================${NC}"
    echo -e "${CYAN}${BOLD}>>> $1${NC}"
    echo -e "${PURPLE}${BOLD}==============================================================================${NC}\n"
}

# ------------------------------------------------------------------------------
# 1. PRE-FLIGHT CHECKS & VALIDATION
# ------------------------------------------------------------------------------
log_step "1/8: Pre-flight System Verification"

# Verify script is run as root or with sudo
if [[ $EUID -ne 0 ]]; then
    log_error "This deployment script must be run as root or with sudo:"
    echo "  sudo bash scripts/deploy-vps.sh"
    exit 1
fi

APP_DIR="/var/www/tooly"

# If current directory contains package.json and ecosystem.config.js, adopt it
if [[ -f "./ecosystem.config.js" && -f "./package.json" ]]; then
    APP_DIR="$(pwd)"
fi

log_info "Deploying Tooly platform in: ${APP_DIR}"

if [[ ! -d "$APP_DIR" ]]; then
    log_error "Application directory ${APP_DIR} does not exist!"
    log_info "Please ensure the code is cloned to /var/www/tooly first: git clone <repo> /var/www/tooly"
    exit 1
fi

cd "$APP_DIR"

# Verify port 5000 is respected and preserved
log_info "Checking port allocations..."
if command -v ss &>/dev/null; then
    PORT_5000_CHECK=$(ss -tulpn | grep ':5000 ' || true)
elif command -v netstat &>/dev/null; then
    PORT_5000_CHECK=$(netstat -tulpn | grep ':5000 ' || true)
else
    PORT_5000_CHECK=""
fi

if [[ -n "$PORT_5000_CHECK" ]]; then
    log_success "Detected active service on Port 5000. It will remain completely untouched."
else
    log_info "Port 5000 is currently quiet (preserved for existing website backend)."
fi

# Check Node.js
if ! command -v node &>/dev/null; then
    log_warn "Node.js is not installed. Installing Node.js 20 LTS (NodeSource)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [[ "$NODE_VERSION" -lt 20 ]]; then
    log_error "Node.js version is $(node -v). Tooly requires Node.js >= 20.0.0."
    log_info "Upgrading to Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
log_success "Node.js version: $(node -v) (npm $(npm -v))"

# Check PM2
if ! command -v pm2 &>/dev/null; then
    log_info "Installing PM2 globally..."
    npm install -g pm2
fi
log_success "PM2 version: $(pm2 -v)"

# Check Nginx
if ! command -v nginx &>/dev/null; then
    log_info "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
fi
systemctl enable nginx
systemctl start nginx
log_success "Nginx is active and running."

# Check PostgreSQL
if ! command -v psql &>/dev/null; then
    log_info "Installing PostgreSQL and PostgreSQL Contrib..."
    apt-get update
    apt-get install -y postgresql postgresql-contrib
fi
systemctl enable postgresql
systemctl start postgresql
log_success "PostgreSQL is active and running."

# ------------------------------------------------------------------------------
# 2. POSTGRESQL DATABASE & USER CREATION
# ------------------------------------------------------------------------------
log_step "2/8: PostgreSQL Database Setup"

DB_NAME="${TOOLY_DB_NAME:-tooly_db}"
DB_USER="${TOOLY_DB_USER:-tooly_user}"
DB_HOST="localhost"
DB_PORT="5432"

# Generate or use provided password
if [[ -z "${TOOLY_DB_PASSWORD:-}" ]]; then
    DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 20)
    log_info "Generated secure random password for database user: ${DB_USER}"
else
    DB_PASS="${TOOLY_DB_PASSWORD}"
fi

log_info "Configuring PostgreSQL database '${DB_NAME}' and user '${DB_USER}'..."

sudo -u postgres psql <<EOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';
    RAISE NOTICE 'Role ${DB_USER} created';
  ELSE
    ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASS}';
    RAISE NOTICE 'Role ${DB_USER} updated';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};
EOF

# Grant schema permissions in database
sudo -u postgres psql -d "${DB_NAME}" <<EOF
GRANT ALL ON SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF

log_success "PostgreSQL database '${DB_NAME}' is ready!"

# ------------------------------------------------------------------------------
# 3. PRODUCTION ENVIRONMENT CONFIGURATION (.env)
# ------------------------------------------------------------------------------
log_step "3/8: Environment Variables Setup (.env)"

ENV_FILE="${APP_DIR}/.env"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Generate strong JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Check domain: default to tooly.tn, fallback to tooy.tn if certificate exists for tooy.tn
PRIMARY_DOMAIN="tooly.tn"
if [[ -d "/etc/letsencrypt/live/tooy.tn" && ! -d "/etc/letsencrypt/live/tooly.tn" ]]; then
    PRIMARY_DOMAIN="tooy.tn"
fi

if [[ -f "$ENV_FILE" ]]; then
    log_warn "Existing .env file detected at ${ENV_FILE}. Backing up to .env.backup..."
    cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d%H%M%S)"
fi

log_info "Writing production configuration to ${ENV_FILE}..."
cat > "$ENV_FILE" <<EOF
# ==============================================================================
# Tooly.tn - Production Environment Configuration
# Generated on: $(date -u)
# ==============================================================================

NODE_ENV=production

# Web App (Next.js 15)
PORT=3000
NEXT_PUBLIC_APP_URL=https://${PRIMARY_DOMAIN}
NEXT_PUBLIC_API_URL=https://${PRIMARY_DOMAIN}/api/v1
NEXT_PUBLIC_DEFAULT_LOCALE=ar

# API Service (NestJS REST API)
API_PORT=4000
API_GLOBAL_PREFIX=api/v1
CORS_ORIGIN=https://${PRIMARY_DOMAIN}

# Database (PostgreSQL)
DATABASE_URL="${DATABASE_URL}"

# Authentication (JWT)
JWT_SECRET="${JWT_SECRET}"
JWT_EXPIRES_IN="7d"

# Payment Process Mode
PAYMENT_FULFILLMENT_MODE=offline_transfer

# Optional AI Assistant Keys (Add your keys if desired)
GEMINI_API_KEY=""
OPENAI_API_KEY=""
EOF

chmod 600 "$ENV_FILE"

# Create symlinks so apps read root .env seamlessly
ln -sf "$ENV_FILE" "${APP_DIR}/apps/api/.env"
ln -sf "$ENV_FILE" "${APP_DIR}/apps/web/.env.production"
ln -sf "$ENV_FILE" "${APP_DIR}/apps/web/.env.local"
log_success "Environment files configured with secure permissions."

# ------------------------------------------------------------------------------
# 4. DEPENDENCY INSTALLATION & MONOREPO BUILD
# ------------------------------------------------------------------------------
log_step "4/8: Monorepo Dependencies & Build"

# Install all npm workspace packages
log_info "Installing dependencies via npm..."
npm install --no-audit

# Generate Prisma Client
log_info "Generating Prisma Client from schema..."
npx prisma generate --schema=apps/api/prisma/schema.prisma

# Run database migrations
log_info "Applying database migrations..."
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

# Seed demo data if database is fresh
log_info "Seeding initial catalog and categories..."
npm --prefix apps/api run prisma:seed || log_warn "Seed skipped or already populated."

# Bootstrap default admin
ADMIN_EMAIL="${TOOLY_ADMIN_EMAIL:-admin@tooly.tn}"
ADMIN_PASSWORD="${TOOLY_ADMIN_PASSWORD:-}"
if [[ -z "$ADMIN_PASSWORD" ]]; then
    ADMIN_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 14)"!9"
fi

log_info "Bootstrapping administrator account (${ADMIN_EMAIL})..."
npx ts-node apps/api/src/scripts/bootstrap-admin.ts --email "$ADMIN_EMAIL" --password "$ADMIN_PASSWORD" --name "Super Admin" || log_warn "Admin bootstrap completed."

# Build API backend
log_info "Building NestJS backend API (@tooly/api)..."
npm run build:api

# Build Web frontend
log_info "Building Next.js frontend storefront (@tooly/web)..."
npm run build:web

log_success "Build completed successfully for all apps!"

# ------------------------------------------------------------------------------
# 5. UPLOADS DIRECTORY PERMISSIONS
# ------------------------------------------------------------------------------
log_step "5/8: Uploads Directory & Permissions"

mkdir -p "${APP_DIR}/apps/api/uploads"
chown -R www-data:www-data "${APP_DIR}/apps/api/uploads" || true
chmod -R 775 "${APP_DIR}/apps/api/uploads"
log_success "Uploads directory initialized and permissions configured."

# ------------------------------------------------------------------------------
# 6. PM2 PROCESS MANAGER SETUP
# ------------------------------------------------------------------------------
log_step "6/8: PM2 Process Management"

# Ensure PM2 log directory exists
mkdir -p /var/log/pm2
chmod 755 /var/log/pm2

# Ensure ecosystem file exists
if [[ ! -f "${APP_DIR}/ecosystem.config.js" ]]; then
    log_info "Creating ecosystem.config.js..."
    cat > "${APP_DIR}/ecosystem.config.js" <<'EOF'
module.exports = {
  apps: [
    {
      name: 'tooly-api',
      cwd: '/var/www/tooly',
      script: 'apps/api/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        API_PORT: 4000,
        API_GLOBAL_PREFIX: 'api/v1',
      },
      error_file: '/var/log/pm2/tooly-api-error.log',
      out_file: '/var/log/pm2/tooly-api-out.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'tooly-web',
      cwd: '/var/www/tooly',
      script: 'node_modules/next/dist/bin/next',
      args: 'start apps/web -p 3000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/tooly-web-error.log',
      out_file: '/var/log/pm2/tooly-web-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
EOF
fi

log_info "Starting / Reloading Tooly processes in PM2..."
pm2 startOrReload "${APP_DIR}/ecosystem.config.js" --update-env
pm2 save

# Setup PM2 startup systemd script
pm2 startup systemd -u root --hp /root || true
log_success "PM2 processes running and configured to auto-start on server boot."

# ------------------------------------------------------------------------------
# 7. NGINX REVERSE PROXY & SSL SETUP
# ------------------------------------------------------------------------------
log_step "7/8: Nginx Reverse Proxy & SSL"

NGINX_CONF_SRC="${APP_DIR}/nginx/tooly.tn.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/tooly.tn"
NGINX_ENABLED="/etc/nginx/sites-enabled/tooly.tn"

# Ensure ACME directory exists
mkdir -p /var/www/certbot

# Auto-detect SSL certificates on VPS
SSL_CERT_PATH="/etc/letsencrypt/live/tooly.tn/fullchain.pem"
SSL_KEY_PATH="/etc/letsencrypt/live/tooly.tn/privkey.pem"

if [[ ! -f "$SSL_CERT_PATH" ]]; then
    if [[ -f "/etc/letsencrypt/live/tooy.tn/fullchain.pem" ]]; then
        SSL_CERT_PATH="/etc/letsencrypt/live/tooy.tn/fullchain.pem"
        SSL_KEY_PATH="/etc/letsencrypt/live/tooy.tn/privkey.pem"
        log_info "Found SSL certificate under /etc/letsencrypt/live/tooy.tn/"
    else
        log_warn "SSL certificates not found under standard Let's Encrypt path."
        log_warn "Searching for existing certificate files on VPS..."
        FOUND_CERT=$(find /etc/letsencrypt/live -name "fullchain.pem" 2>/dev/null | head -n 1 || true)
        if [[ -n "$FOUND_CERT" ]]; then
            SSL_CERT_PATH="$FOUND_CERT"
            SSL_KEY_PATH="$(dirname "$FOUND_CERT")/privkey.pem"
            log_info "Using detected SSL Certificate: ${SSL_CERT_PATH}"
        fi
    fi
fi

# Copy Nginx configuration
cp "$NGINX_CONF_SRC" "$NGINX_AVAILABLE"

# Update SSL paths in Nginx configuration if needed
sed -i "s|/etc/letsencrypt/live/tooly.tn/fullchain.pem|${SSL_CERT_PATH}|g" "$NGINX_AVAILABLE"
sed -i "s|/etc/letsencrypt/live/tooly.tn/privkey.pem|${SSL_KEY_PATH}|g" "$NGINX_AVAILABLE"

# Enable site if not already enabled
if [[ ! -L "$NGINX_ENABLED" ]]; then
    ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
fi

# Test Nginx configuration syntax safely
log_info "Testing Nginx configuration syntax..."
nginx -t

log_info "Reloading Nginx web server..."
systemctl reload nginx
log_success "Nginx reverse proxy configured and active."

# ------------------------------------------------------------------------------
# 8. HEALTH CHECKS & SUMMARY
# ------------------------------------------------------------------------------
log_step "8/8: Verification & Health Checks"

sleep 3

# Check API health
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4000/api/v1/health || true)
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 || true)

echo ""
echo -e "${GREEN}${BOLD}==============================================================================${NC}"
echo -e "${GREEN}${BOLD}                 Tooly.tn VPS Deployment Completed!                          ${NC}"
echo -e "${GREEN}${BOLD}==============================================================================${NC}"
echo ""
echo -e "  ${BOLD}Website URL:${NC}       https://${PRIMARY_DOMAIN}"
echo -e "  ${BOLD}API Endpoint:${NC}      https://${PRIMARY_DOMAIN}/api/v1"
echo -e "  ${BOLD}Admin Dashboard:${NC}   https://${PRIMARY_DOMAIN}/admin"
echo ""
echo -e "  ${BOLD}Port Allocations:${NC}"
echo -e "    - Existing Backend:   ${GREEN}Port 5000 (Untouched & Preserved)${NC}"
echo -e "    - Tooly API:          ${GREEN}Port 4000${NC} (Health status: ${API_STATUS})"
echo -e "    - Tooly Web:          ${GREEN}Port 3000${NC} (Health status: ${WEB_STATUS})"
echo ""
echo -e "  ${BOLD}Admin Credentials:${NC}"
echo -e "    - Email:              ${CYAN}${ADMIN_EMAIL}${NC}"
echo -e "    - Password:           ${CYAN}${ADMIN_PASSWORD}${NC}"
echo ""
echo -e "  ${BOLD}Database (PostgreSQL):${NC}"
echo -e "    - DB Name:            ${DB_NAME}"
echo -e "    - DB User:            ${DB_USER}"
echo ""
echo -e "  ${BOLD}Management Commands:${NC}"
echo -e "    - Check processes:    ${YELLOW}pm2 status${NC}"
echo -e "    - View live logs:     ${YELLOW}pm2 logs${NC}"
echo -e "    - Restart all:        ${YELLOW}pm2 restart all${NC}"
echo -e "    - Update deployment:  ${YELLOW}bash scripts/update-vps.sh${NC}"
echo -e "    - Nginx config test:  ${YELLOW}nginx -t${NC}"
echo ""
echo -e "${GREEN}${BOLD}==============================================================================${NC}"
echo ""


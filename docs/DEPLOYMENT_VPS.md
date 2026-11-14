# Tooly.tn — Production VPS Deployment Guide

This guide details the complete deployment process for **Tooly.tn** on a Linux VPS (Ubuntu/Debian) where another website is already hosted and running its backend on **port 5000**.

---

## 1. Architectural Overview & Port Isolation

```
                                      Internet
                                         │
                                         ▼
                            ┌────────────────────────┐
                            │      Nginx (80/443)    │
                            │   SSL: LetsEncrypt     │
                            └────────────┬───────────┘
                                         │
                ┌────────────────────────┴────────────────────────┐
                │                                                 │
                ▼                                                 ▼
     Existing Site Domain                               tooly.tn / tooy.tn
  ┌───────────────────────┐                    ┌─────────────────────────────────────┐
  │ Port 5000 (Backend)   │                    │  /api/v1  ──► Port 4000 (Tooly API) │
  │ (Completely untouched)│                    │  /        ──► Port 3000 (Next.js)   │
  └───────────────────────┘                    └──────────────────┬──────────────────┘
                                                                  │
                                                       ┌──────────┴──────────┐
                                                       │ PostgreSQL: 5432    │
                                                       │ DB: tooly_db        │
                                                       │ User: tooly_user    │
                                                       └─────────────────────┘
```

### Port Allocation:
| Service | Port | Host Binding | Status |
| :--- | :--- | :--- | :--- |
| **Existing Website Backend** | `5000` | `127.0.0.1:5000` | **Untouched & Preserved** |
| **Tooly API (NestJS REST)** | `4000` | `127.0.0.1:4000` | New |
| **Tooly Web (Next.js 15)** | `3000` | `127.0.0.1:3000` | New |
| **PostgreSQL Database** | `5432` | `127.0.0.1:5432` | New Database (`tooly_db`) |

---

## 2. Quick Automated Deployment (Recommended)

The automated script handles **everything**: PostgreSQL user/database creation, `.env` generation with cryptographically secure secrets, Prisma migrations, admin bootstrap, monorepo build, PM2 process management, and Nginx reverse proxy configuration.

### Step 1: Clone Repository to `/var/www/tooly`
```bash
sudo git clone https://github.com/your-org/tooly.git /var/www/tooly
cd /var/www/tooly
sudo chown -R $USER:$USER /var/www/tooly
```

### Step 2: Make Scripts Executable
```bash
chmod +x scripts/*.sh
```

### Step 3: Run Master Deployment Script
```bash
sudo bash scripts/deploy-vps.sh
```

The script will automatically:
1. Verify system tools (Node.js 20+, npm, git, PostgreSQL, Nginx, PM2).
2. Validate that **port 5000** is untouched.
3. Create PostgreSQL user `tooly_user` and database `tooly_db` with strong permissions.
4. Generate `/var/www/tooly/.env` with production configurations and strong JWT secret.
5. Install npm dependencies across all workspaces.
6. Run Prisma schema generation and database migrations (`prisma migrate deploy`).
7. Seed initial catalog, categories, and payment instructions.
8. Bootstrap the initial Super-Admin user.
9. Build the NestJS API and Next.js 15 storefront.
10. Configure and start PM2 with auto-restart on crash and systemd server boot hook.
11. Detect existing SSL certificates for `tooly.tn` / `tooy.tn` and configure Nginx at `/etc/nginx/sites-available/tooly.tn`.
12. Perform health check tests on `127.0.0.1:4000` and `127.0.0.1:3000`.

---

## 3. Routine Updates (Zero Downtime)

Whenever you push new code to GitHub, deploy updates with a single command:

```bash
sudo bash /var/www/tooly/scripts/update-vps.sh
```

This script automatically pulls changes, installs dependencies, applies database migrations, builds production assets, and reloads PM2 processes with **zero downtime**.

---

## 4. Manual Step-by-Step Breakdown

If you prefer to run steps manually or need to debug:

### 4.1 Database Setup (PostgreSQL)
```bash
sudo -u postgres psql
```
```sql
CREATE ROLE tooly_user WITH LOGIN PASSWORD 'your_secure_password';
CREATE DATABASE tooly_db OWNER tooly_user;
GRANT ALL PRIVILEGES ON DATABASE tooly_db TO tooly_user;
\c tooly_db
GRANT ALL ON SCHEMA public TO tooly_user;
\q
```

### 4.2 Production Environment (`/var/www/tooly/.env`)
```bash
cp .env.example .env
nano .env
```
Ensure the following production values:
```ini
NODE_ENV=production
PORT=3000
API_PORT=4000
API_GLOBAL_PREFIX=api/v1
NEXT_PUBLIC_APP_URL=https://tooly.tn
NEXT_PUBLIC_API_URL=https://tooly.tn/api/v1
CORS_ORIGIN=https://tooly.tn
DATABASE_URL="postgresql://tooly_user:your_secure_password@localhost:5432/tooly_db?schema=public"
JWT_SECRET="your_random_64_character_hex_secret"
JWT_EXPIRES_IN="7d"
PAYMENT_FULFILLMENT_MODE=offline_transfer
```

### 4.3 Build & Database Migration
```bash
npm install
npm run build:packages
npx prisma generate --schema=apps/api/prisma/schema.prisma
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma
npm --prefix apps/api run prisma:seed
npx ts-node apps/api/src/scripts/bootstrap-admin.ts --email admin@tooly.tn --password "StrongAdminPassword123!"
npm run build
```

### 4.4 Process Management with PM2
```bash
pm2 start ecosystem.config.js --update-env
pm2 save
pm2 startup
```

### 4.5 Nginx Configuration
Copy the configuration template:
```bash
sudo cp nginx/tooly.tn.conf /etc/nginx/sites-available/tooly.tn
sudo ln -sf /etc/nginx/sites-available/tooly.tn /etc/nginx/sites-enabled/tooly.tn
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Daily Operations & Commands

| Action | Command |
| :--- | :--- |
| **Check Process Status** | `pm2 status` |
| **Stream Live Logs** | `pm2 logs` |
| **Stream API Logs Only** | `pm2 logs tooly-api` |
| **Stream Web Logs Only** | `pm2 logs tooly-web` |
| **Restart Services** | `pm2 restart all` |
| **Check Port Status** | `ss -tulpn \| grep -E ':(3000\|4000\|5000)'` |
| **Test Nginx Syntax** | `sudo nginx -t` |
| **Reload Nginx** | `sudo systemctl reload nginx` |
| **PostgreSQL Shell** | `sudo -u postgres psql -d tooly_db` |

---

## 6. Security & Firewall Checklist

1. **UFW Firewall**:
   Only ports `80` (HTTP), `443` (HTTPS), and `22` (SSH) should be open to the public internet:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```
   Ports `3000`, `4000`, `5000`, and `5432` remain strictly internal (`127.0.0.1`), accessible only via Nginx reverse proxy.
2. **SSL Auto-Renewal**:
   Verify Let's Encrypt renew timer:
   ```bash
   sudo systemctl status certbot.timer
   ```


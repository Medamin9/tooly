/**
 * PM2 Ecosystem Configuration for Tooly.tn
 * Production deployment on Linux VPS (/var/www/tooly)
 *
 * Conflict-free Port Allocation:
 * - Existing website backend: Port 5000 (Untouched)
 * - Tooly API (NestJS): Port 4000
 * - Tooly Web (Next.js): Port 3000
 */

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


import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from repo root or local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function bootstrapAdmin() {
  const args = process.argv.slice(2);
  let email = '';
  let password = '';
  let name = 'Tooly Administrator';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) email = args[i + 1];
    if (args[i] === '--password' && args[i + 1]) password = args[i + 1];
    if (args[i] === '--name' && args[i + 1]) name = args[i + 1];
  }

  if (!email || !password) {
    console.error('Usage: ts-node src/scripts/bootstrap-admin.ts --email <admin_email> --password <strong_password> [--name <admin_name>]');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters.');
    process.exit(1);
  }

  console.log(`Checking existing user for email: ${email}...`);
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: Role.ADMIN,
        passwordHash,
        isActive: true,
      },
    });
    console.log(`Successfully elevated existing user "${email}" to ADMIN with updated password.`);
  } else {
    const created = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`Successfully created new ADMIN user "${created.email}" (ID: ${created.id}).`);
  }
}

bootstrapAdmin()
  .catch((e) => {
    console.error('Bootstrap error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

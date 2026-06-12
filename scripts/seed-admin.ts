/**
 * Seed an admin user via better-auth.
 * Usage: npx tsx scripts/seed-admin.ts <email> <password> [name]
 * Requires DB tables to exist (run `prisma db push` first).
 */
import { auth } from '@/lib/auth/better-auth';
import prisma from '@/lib/prisma';

async function main() {
  const [email, password, name = 'Admin'] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/seed-admin.ts <email> <password> [name]');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await auth.api.signUpEmail({ body: { email, password, name } });
    console.log(`Created user ${email}`);
  } else {
    console.log(`User ${email} already exists`);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: 'admin', emailVerified: true },
  });

  console.log(`Set role=admin for ${updated.email} (id=${updated.id})`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

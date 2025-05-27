import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash('GreenFlag123', 10);

  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { username: 'greenflag' },
    update: {},
    create: {
      username: 'greenflag',
      name: 'The Green Flag',
      password: hashedPassword
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
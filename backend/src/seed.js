require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('./database/prismaClient');

async function main() {
  console.log('Seeding database...');

  // clear (for sqlite in dev only)
  await prisma.booking.deleteMany().catch(()=>{});
  await prisma.client.deleteMany().catch(()=>{});
  await prisma.user.deleteMany().catch(()=>{});

  const pass = await bcrypt.hash('password123', 10);

  const user = await prisma.user.create({
    data: { email: 'admin@example.com', password: pass, name: 'Admin', role: 'admin' }
  });

  const client1 = await prisma.client.create({
    data: { name: 'João Silva', phone: '11999990000', email: 'joao@example.com', notes: 'Cliente VIP' }
  });

  const client2 = await prisma.client.create({
    data: { name: 'Maria Souza', phone: '11988880000', email: 'maria@example.com' }
  });

  // create some bookings for today
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const start1 = new Date(today.getTime() + 10 * 60 * 60 * 1000); // today 10:00 UTC
  const end1 = new Date(start1.getTime() + 60 * 60000); // 1 hour

  const start2 = new Date(today.getTime() + 12 * 60 * 60 * 1000);
  const end2 = new Date(start2.getTime() + 30 * 60000);

  await prisma.booking.create({
    data: {
      clientId: client1.id,
      start: start1,
      end: end1,
      service: 'Corte de cabelo'
    }
  });

  await prisma.booking.create({
    data: {
      clientId: client2.id,
      start: start2,
      end: end2,
      service: 'Manicure'
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

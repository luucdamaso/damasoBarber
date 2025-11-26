(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('Conectado ao DB com Prisma');

    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name`;
    console.log('Tabelas (amostra):', tables);

    const bookings = await prisma.booking.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log('Bookings (amostra):', bookings);

    await prisma.$disconnect();
  } catch (err) {
    console.error('ERRO Conexão DB:', err.message);
    process.exit(1);
  }
})();
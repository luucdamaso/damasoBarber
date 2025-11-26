require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

(async () => {
  const prisma = new PrismaClient();
  try {
    const hash = await bcrypt.hash("123456", 10);
    const result = await prisma.user.updateMany({
      where: { email: "admin@example.com" },
      data: { password: hash }
    });
    console.log("Senha atualizada:", result);
  } catch (e) {
    console.error("Erro ao atualizar:", e);
  } finally {
    await prisma.$disconnect();
  }
})();

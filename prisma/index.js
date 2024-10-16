const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;


async register(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: { email, password: hashedPassword },
    });
    return customer;
  }
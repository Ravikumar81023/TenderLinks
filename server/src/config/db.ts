import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
// Connect to the database to check if it's working properly
async function checkDatabaseConnection() {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Call the function to check the connection
checkDatabaseConnection();
export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

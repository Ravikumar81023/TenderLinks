import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const startTTLJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running TTL job...");

    const now = new Date();

    // Remove expired tenders
    await prisma.tender.deleteMany({
      where: {
        expiryDate: {
          lt: now,
        },
      },
    });

    // Remove customers with expired subscriptions
    await prisma.customerUser.deleteMany({
      where: {
        subscriptionValidity: {
          lt: now,
        },
      },
    });

    console.log("TTL job completed.");
  });
};

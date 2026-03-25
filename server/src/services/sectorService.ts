import { PrismaClient, Sector } from "@prisma/client";

const prisma = new PrismaClient();

export class SectorService {
  async createSector(name: string): Promise<Sector> {
    return prisma.sector.create({
      data: { name },
    });
  }

  async getSectors(): Promise<Sector[]> {
    return prisma.sector.findMany();
  }

  async getSectorById(id: number): Promise<Sector | null> {
    return prisma.sector.findUnique({
      where: { id },
    });
  }

  async updateSector(id: number, name: string): Promise<Sector> {
    return prisma.sector.update({
      where: { id },
      data: { name },
    });
  }

  async deleteSector(id: number): Promise<Sector> {
    return prisma.sector.delete({
      where: { id },
    });
  }
}

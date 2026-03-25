import { PrismaClient, Location } from "@prisma/client";

const prisma = new PrismaClient();

export class LocationService {
  async createLocation(data: {
    state: string;
    district: string;
    city?: string;
  }): Promise<Location> {
    return prisma.location.create({
      data,
    });
  }

  async getLocations(): Promise<Location[]> {
    return prisma.location.findMany();
  }

  async getLocationById(id: number): Promise<Location | null> {
    return prisma.location.findUnique({
      where: { id },
    });
  }

  async updateLocation(
    id: number,
    data: { state?: string; district?: string; city?: string },
  ): Promise<Location> {
    return prisma.location.update({
      where: { id },
      data,
    });
  }

  async deleteLocation(id: number): Promise<Location> {
    return prisma.location.delete({
      where: { id },
    });
  }
}

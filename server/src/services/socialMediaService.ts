import { PrismaClient, SocialMedia } from "@prisma/client";

const prisma = new PrismaClient();

export class SocialMediaService {
    async createSocialMedia(data: Omit<SocialMedia, "id">): Promise<SocialMedia> {
        return prisma.socialMedia.create({
            data,
        });
    }


    async getSocialMedia(): Promise<SocialMedia[]> {
        return prisma.socialMedia.findMany();
    }


    async getSocialMediaById(id: number): Promise<SocialMedia | null> {
        return prisma.socialMedia.findUnique({
            where: { id },
        });

    }

    async updateSocialMedia(id: number, data: Partial<Omit<SocialMedia, "id">>): Promise<SocialMedia> {
        return prisma.socialMedia.update({
            where: { id },
            data,
        });
    }
    

    async deleteSocialMedia(id: number): Promise<SocialMedia> {
        return prisma.socialMedia.delete({
            where: { id },
        })
    }
}


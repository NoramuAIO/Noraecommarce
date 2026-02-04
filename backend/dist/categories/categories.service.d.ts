import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
        image: string | null;
    })[]>;
    findById(id: number): Promise<{
        products: {
            id: number;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            version: string;
            slug: string;
            description: string;
            longDescription: string | null;
            price: number;
            originalPrice: number | null;
            image: string | null;
            downloadUrl: string | null;
            licenseKey: string | null;
            minecraftVersions: string;
            downloads: number;
            rating: number;
            reviews: number;
            badge: string | null;
            features: string | null;
            requirements: string | null;
            updatePolicy: string;
            images: string | null;
            discordRoleId: string | null;
            seoTitle: string | null;
            seoDescription: string | null;
            seoKeywords: string | null;
            categoryId: number;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
        image: string | null;
    }>;
    create(data: {
        name: string;
        icon: string;
    }): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
        image: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
        image: string | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
        image: string | null;
    }>;
}

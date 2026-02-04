import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
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
    findOne(id: string): Promise<{
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
    update(id: string, data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
        image: string | null;
    }>;
    delete(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
        image: string | null;
    }>;
}

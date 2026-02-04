import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    getUserFavorites(req: any): Promise<({
        product: {
            category: {
                id: number;
                name: string;
                createdAt: Date;
                slug: string;
                image: string | null;
            };
        } & {
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
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    })[]>;
    addFavorite(req: any, productId: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    }>;
    removeFavorite(req: any, productId: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    }>;
    isFavorite(req: any, productId: string): Promise<{
        isFavorite: boolean;
    }>;
    getNotifications(req: any): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        type: string;
        message: string;
        productId: number;
        oldValue: string | null;
        newValue: string | null;
        read: boolean;
    }[]>;
    markNotificationRead(req: any, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllNotificationsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}

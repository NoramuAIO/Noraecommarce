import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class FavoritesService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    getUserFavorites(userId: number): Promise<({
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
    addFavorite(userId: number, productId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    }>;
    removeFavorite(userId: number, productId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    }>;
    isFavorite(userId: number, productId: number): Promise<boolean>;
    getProductFavoriteUsers(productId: number): Promise<({
        user: {
            id: number;
            email: string;
            password: string;
            name: string;
            avatar: string | null;
            role: string;
            status: string;
            balance: number;
            discordId: string | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            emailVerified: boolean;
            emailVerificationToken: string | null;
            emailVerificationExpiry: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        productId: number;
    })[]>;
    notifyFavoriteUsers(productId: number, type: string, message: string, oldValue?: string, newValue?: string): Promise<void>;
    getUserNotifications(userId: number): Promise<{
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
    markNotificationRead(notificationId: number, userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllNotificationsRead(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
}

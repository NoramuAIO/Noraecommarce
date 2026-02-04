import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(categoryId?: number, includeFree?: boolean): Promise<({
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
    })[]>;
    findFree(): Promise<({
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
    })[]>;
    findPaid(categoryId?: number): Promise<({
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
    })[]>;
    findBestSellers(limit?: number): Promise<({
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
    })[]>;
    findById(id: number): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
            image: string | null;
        };
        changelogs: {
            id: number;
            createdAt: Date;
            version: string;
            changes: string;
            productId: number;
        }[];
        productReviews: {
            id: number;
            createdAt: Date;
            rating: number;
            productId: number;
            comment: string;
            userName: string;
            approved: boolean;
        }[];
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
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
            image: string | null;
        };
        changelogs: {
            id: number;
            createdAt: Date;
            version: string;
            changes: string;
            productId: number;
        }[];
        productReviews: {
            id: number;
            createdAt: Date;
            rating: number;
            productId: number;
            comment: string;
            userName: string;
            approved: boolean;
        }[];
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
    }>;
    create(data: any): Promise<{
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
    }>;
    update(id: number, data: any, notifyFavorites?: (productId: number, type: string, message: string, oldValue?: string, newValue?: string) => Promise<void>): Promise<{
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
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    incrementDownloads(id: number): Promise<{
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
    }>;
    getChangelogs(productId: number): Promise<{
        id: number;
        createdAt: Date;
        version: string;
        changes: string;
        productId: number;
    }[]>;
    createChangelog(productId: number, data: {
        version: string;
        changes: string[];
    }, notifyFavorites?: (productId: number, type: string, message: string, oldValue?: string, newValue?: string) => Promise<void>): Promise<{
        id: number;
        createdAt: Date;
        version: string;
        changes: string;
        productId: number;
    }>;
    deleteChangelog(id: number): Promise<{
        id: number;
        createdAt: Date;
        version: string;
        changes: string;
        productId: number;
    }>;
    getReviews(productId: number, adminView?: boolean): Promise<{
        id: number;
        createdAt: Date;
        rating: number;
        productId: number;
        comment: string;
        userName: string;
        approved: boolean;
    }[]>;
    getAllReviewsAdmin(): Promise<({
        product: {
            id: number;
            name: string;
            image: string;
        };
    } & {
        id: number;
        createdAt: Date;
        rating: number;
        productId: number;
        comment: string;
        userName: string;
        approved: boolean;
    })[]>;
    createReview(productId: number, data: {
        rating: number;
        comment: string;
        userName: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        rating: number;
        productId: number;
        comment: string;
        userName: string;
        approved: boolean;
    }>;
    updateReview(id: number, data: {
        approved?: boolean;
    }): Promise<{
        id: number;
        createdAt: Date;
        rating: number;
        productId: number;
        comment: string;
        userName: string;
        approved: boolean;
    }>;
    deleteReview(id: number): Promise<void>;
    private updateProductRating;
}

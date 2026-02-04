import { ProductsService } from './products.service';
import { FavoritesService } from '../favorites/favorites.service';
export declare class ProductsController {
    private productsService;
    private favoritesService;
    constructor(productsService: ProductsService, favoritesService: FavoritesService);
    findAll(categoryId?: string): Promise<({
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
    findPaid(categoryId?: string): Promise<({
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
    findBestSellers(limit?: string): Promise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, data: any): Promise<{
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
    delete(id: string): Promise<{
        success: boolean;
    }>;
    getChangelogs(id: string): Promise<{
        id: number;
        createdAt: Date;
        version: string;
        changes: string;
        productId: number;
    }[]>;
    createChangelog(id: string, data: {
        version: string;
        changes: string[];
    }): Promise<{
        id: number;
        createdAt: Date;
        version: string;
        changes: string;
        productId: number;
    }>;
    deleteChangelog(changelogId: string): Promise<{
        id: number;
        createdAt: Date;
        version: string;
        changes: string;
        productId: number;
    }>;
    getReviews(id: string): Promise<{
        id: number;
        createdAt: Date;
        rating: number;
        productId: number;
        comment: string;
        userName: string;
        approved: boolean;
    }[]>;
    getReviewsAdmin(id: string): Promise<{
        id: number;
        createdAt: Date;
        rating: number;
        productId: number;
        comment: string;
        userName: string;
        approved: boolean;
    }[]>;
    createReview(id: string, data: {
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
    updateReview(reviewId: string, data: {
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
    deleteReview(reviewId: string): Promise<void>;
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
}

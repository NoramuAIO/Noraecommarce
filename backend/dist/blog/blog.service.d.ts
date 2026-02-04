import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    private calculateReadTime;
    findAll(categoryId?: number): Promise<({
        category: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        categoryId: number | null;
        title: string;
        excerpt: string;
        content: string;
        author: string;
        readTime: string;
        featured: boolean;
    })[]>;
    findById(id: number): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        categoryId: number | null;
        title: string;
        excerpt: string;
        content: string;
        author: string;
        readTime: string;
        featured: boolean;
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        categoryId: number | null;
        title: string;
        excerpt: string;
        content: string;
        author: string;
        readTime: string;
        featured: boolean;
    }>;
    create(data: any): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        categoryId: number | null;
        title: string;
        excerpt: string;
        content: string;
        author: string;
        readTime: string;
        featured: boolean;
    }>;
    update(id: number, data: any): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        categoryId: number | null;
        title: string;
        excerpt: string;
        content: string;
        author: string;
        readTime: string;
        featured: boolean;
    }>;
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        categoryId: number | null;
        title: string;
        excerpt: string;
        content: string;
        author: string;
        readTime: string;
        featured: boolean;
    }>;
    findAllCategories(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
    })[]>;
    createCategory(data: {
        name: string;
    }): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
    }>;
    updateCategory(id: number, data: {
        name: string;
    }): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
    }>;
    deleteCategory(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
    }>;
}

import { BlogService } from './blog.service';
export declare class BlogController {
    private blogService;
    constructor(blogService: BlogService);
    findAll(categoryId?: string): Promise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, data: any): Promise<{
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
    delete(id: string): Promise<{
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
    updateCategory(id: string, data: {
        name: string;
    }): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
    }>;
    deleteCategory(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        slug: string;
    }>;
}

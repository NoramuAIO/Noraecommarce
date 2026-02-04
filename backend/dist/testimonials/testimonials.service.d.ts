import { PrismaService } from '../prisma/prisma.service';
export declare class TestimonialsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }[]>;
    findAllAdmin(): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }[]>;
    create(data: {
        name: string;
        role: string;
        content: string;
        rating: number;
    }): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }>;
    update(id: number, data: Partial<{
        name: string;
        role: string;
        content: string;
        rating: number;
        order: number;
        active: boolean;
    }>): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }>;
    delete(id: number): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }>;
}

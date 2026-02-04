import { PrismaService } from '../prisma/prisma.service';
export declare class FaqService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(category?: string): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }[]>;
    findById(id: number): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
    create(data: {
        question: string;
        answer: string;
        category: string;
        order?: number;
    }): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
    update(id: number, data: any): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
    delete(id: number): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
}

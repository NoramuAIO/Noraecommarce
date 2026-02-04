import { PrismaService } from '../prisma/prisma.service';
export declare class FeaturesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }[]>;
    findAllAdmin(): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }[]>;
    create(data: {
        title: string;
        description: string;
        icon: string;
        color: string;
    }): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }>;
    update(id: number, data: Partial<{
        title: string;
        description: string;
        icon: string;
        color: string;
        order: number;
        active: boolean;
    }>): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }>;
    delete(id: number): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }>;
}

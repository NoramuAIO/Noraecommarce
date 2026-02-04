import { PrismaService } from '../prisma/prisma.service';
export declare class ReferencesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activeOnly?: boolean): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }[]>;
    findById(id: number): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
    create(data: {
        name: string;
        image: string;
        website?: string;
        discord?: string;
    }): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
    update(id: number, data: any): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
    delete(id: number): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{}>;
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<{
        id: number;
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    setMany(settings: Record<string, string>): Promise<{
        id: number;
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
}

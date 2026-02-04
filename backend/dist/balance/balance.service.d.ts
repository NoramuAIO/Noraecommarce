import { PrismaService } from '../prisma/prisma.service';
export declare class BalanceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllPackages(): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        price: number;
        bonus: number;
        popular: boolean;
    }[]>;
    createPackage(data: {
        amount: number;
        bonus: number;
        price: number;
        popular?: boolean;
    }): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        price: number;
        bonus: number;
        popular: boolean;
    }>;
    updatePackage(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        price: number;
        bonus: number;
        popular: boolean;
    }>;
    deletePackage(id: number): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        price: number;
        bonus: number;
        popular: boolean;
    }>;
    addBalance(userId: number, amount: number, bonus?: number): Promise<{
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
    }>;
    deductBalance(userId: number, amount: number): Promise<{
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
    }>;
}

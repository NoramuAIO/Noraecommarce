import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: number;
        email: string;
        name: string;
        role: string;
        balance: number;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        email: string;
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
    update(id: string, data: any): Promise<{
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
    updateBalance(id: string, data: {
        newBalance: number;
        type: string;
        isRevenue: boolean;
        note?: string;
    }, req: any): Promise<{
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
    delete(id: string): Promise<{
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

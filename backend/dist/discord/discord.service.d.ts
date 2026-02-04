import { PrismaService } from '../prisma/prisma.service';
export declare class DiscordService {
    private prisma;
    constructor(prisma: PrismaService);
    private getDiscordSettings;
    addRoleToUser(discordId: string, roleId: string): Promise<boolean>;
    giveCustomerRole(userId: number): Promise<boolean>;
    givePremiumRole(userId: number): Promise<boolean>;
    handleOrderCompleted(userId: number, isPaid: boolean, productId?: number): Promise<void>;
    giveProductRole(userId: number, productId: number): Promise<boolean>;
}

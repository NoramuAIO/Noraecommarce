import { PrismaService } from '../../prisma/prisma.service';
import { SettingsService } from '../../settings/settings.service';
export interface PaymentData {
    userId: number;
    amount: number;
    email: string;
    userName: string;
    userPhone?: string;
    userIp: string;
    packageId?: number;
}
export declare class IyzicoProvider {
    private prisma;
    private settingsService;
    constructor(prisma: PrismaService, settingsService: SettingsService);
    isEnabled(): Promise<boolean>;
    createPayment(data: PaymentData): Promise<unknown>;
    handleCallback(token: string): Promise<unknown>;
}

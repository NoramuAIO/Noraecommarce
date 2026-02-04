import { PrismaService } from '../../prisma/prisma.service';
import { SettingsService } from '../../settings/settings.service';
export interface PaymentData {
    userId: number;
    amount: number;
    email: string;
    userName: string;
    userPhone?: string;
    userAddress?: string;
    userIp: string;
    packageId?: number;
}
export declare class PaytrProvider {
    private prisma;
    private settingsService;
    constructor(prisma: PrismaService, settingsService: SettingsService);
    isEnabled(): Promise<boolean>;
    createPayment(data: PaymentData): Promise<{
        token: any;
        merchantOid: string;
        iframeUrl: string;
    }>;
    handleCallback(body: any): Promise<string>;
}

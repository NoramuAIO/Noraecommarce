import { PrismaService } from '../../prisma/prisma.service';
import { SettingsService } from '../../settings/settings.service';
export interface PaymentData {
    userId: number;
    amount: number;
    email: string;
    packageId?: number;
}
export declare class PaparaProvider {
    private prisma;
    private settingsService;
    constructor(prisma: PrismaService, settingsService: SettingsService);
    isEnabled(): Promise<boolean>;
    createPayment(data: PaymentData): Promise<{
        paymentUrl: any;
        paymentId: any;
        referenceId: string;
    }>;
    handleCallback(body: any): Promise<{
        success: boolean;
    }>;
}

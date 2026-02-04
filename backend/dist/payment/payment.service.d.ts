import { PrismaService } from '../prisma/prisma.service';
import { PaytrProvider } from './providers/paytr.provider';
import { IyzicoProvider } from './providers/iyzico.provider';
import { PaparaProvider } from './providers/papara.provider';
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
export declare class PaymentService {
    private prisma;
    private paytrProvider;
    private iyzicoProvider;
    private paparaProvider;
    constructor(prisma: PrismaService, paytrProvider: PaytrProvider, iyzicoProvider: IyzicoProvider, paparaProvider: PaparaProvider);
    getActiveProviders(): Promise<any[]>;
    createPayment(provider: string, data: PaymentData): Promise<unknown>;
    handlePaytrCallback(body: any): Promise<string>;
    handleIyzicoCallback(token: string): Promise<unknown>;
    handlePaparaCallback(body: any): Promise<{
        success: boolean;
    }>;
    getPaymentStatus(merchantOid: string, userId: number): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        amount: number;
        merchantOid: string;
        provider: string;
        packageId: number | null;
    }>;
    getUserPayments(userId: number): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        amount: number;
        merchantOid: string;
        provider: string;
        packageId: number | null;
    }[]>;
}

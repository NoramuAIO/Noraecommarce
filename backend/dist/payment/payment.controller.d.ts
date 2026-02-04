import { PaymentService } from './payment.service';
import { Response } from 'express';
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    getProviders(): Promise<any[]>;
    createPayment(body: any, req: any): Promise<unknown>;
    paytrCallback(body: any, res: Response): Promise<void>;
    iyzicoCallback(body: any, res: Response): Promise<void>;
    paparaCallback(body: any): Promise<{
        success: boolean;
    }>;
    getPaymentStatus(merchantOid: string, req: any): Promise<{
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
    getPaymentHistory(req: any): Promise<{
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

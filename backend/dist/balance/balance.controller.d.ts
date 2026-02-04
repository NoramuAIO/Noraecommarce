import { BalanceService } from './balance.service';
export declare class BalanceController {
    private balanceService;
    constructor(balanceService: BalanceService);
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
    updatePackage(id: string, data: any): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        price: number;
        bonus: number;
        popular: boolean;
    }>;
    deletePackage(id: string): Promise<{
        id: number;
        createdAt: Date;
        amount: number;
        price: number;
        bonus: number;
        popular: boolean;
    }>;
}

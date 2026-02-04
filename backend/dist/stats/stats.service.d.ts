import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        openTickets: number;
        totalRevenue: number;
        totalExpense: number;
        recentTransactions: {
            revenues: {
                id: string;
                source: string;
                amount: number;
                description: string;
                user: {
                    id: number;
                    email: string;
                    name: string;
                };
                createdAt: Date;
            }[];
            expenses: {
                id: string;
                source: string;
                amount: number;
                description: string;
                user: {
                    id: number;
                    email: string;
                    name: string;
                };
                createdAt: Date;
                note: string;
            }[];
        };
        charts: {
            revenueChart: any[];
            ordersChart: any[];
            categoryChart: {
                name: string;
                sales: number;
                revenue: number;
            }[];
        };
        todayStats: {
            todayOrders: number;
            yesterdayOrders: number;
            ordersChange: string | number;
            todayRevenue: number;
            yesterdayRevenue: number;
            revenueChange: string | number;
            todayUsers: number;
            yesterdayUsers: number;
            usersChange: string | number;
        };
    }>;
    private getRecentTransactions;
    private getLast7DaysRevenue;
    private getLast30DaysOrders;
    private getSalesByCategory;
    private getTodayStats;
    getPublicStats(): Promise<{
        products: number;
        users: number;
        orders: number;
        avgResponseTime: number;
        todayResolved: number;
        hasTicketStats: boolean;
    }>;
}

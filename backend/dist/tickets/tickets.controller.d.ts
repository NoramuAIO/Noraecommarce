import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private ticketsService;
    constructor(ticketsService: TicketsService);
    findAll(): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
        };
        replies: {
            id: number;
            createdAt: Date;
            message: string;
            isAdmin: boolean;
            adminName: string | null;
            ticketId: number;
        }[];
    } & {
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    })[]>;
    findMyTickets(req: any): Promise<({
        replies: {
            id: number;
            createdAt: Date;
            message: string;
            isAdmin: boolean;
            adminName: string | null;
            ticketId: number;
        }[];
    } & {
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
        replies: {
            id: number;
            createdAt: Date;
            message: string;
            isAdmin: boolean;
            adminName: string | null;
            ticketId: number;
        }[];
    } & {
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    }>;
    create(req: any, data: {
        subject: string;
        message: string;
        category: string;
        priority?: string;
    }): Promise<{
        user: {
            email: string;
            name: string;
        };
        replies: {
            id: number;
            createdAt: Date;
            message: string;
            isAdmin: boolean;
            adminName: string | null;
            ticketId: number;
        }[];
    } & {
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    }>;
    addReply(req: any, id: string, data: {
        message: string;
    }): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
        replies: {
            id: number;
            createdAt: Date;
            message: string;
            isAdmin: boolean;
            adminName: string | null;
            ticketId: number;
        }[];
    } & {
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    }>;
    updateStatus(id: string, data: {
        status: string;
    }): Promise<{
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    }>;
    updateAdminNote(id: string, data: {
        adminNote: string;
    }): Promise<{
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    }>;
    close(id: string): Promise<{
        category: string;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        subject: string;
        priority: string;
        message: string;
        adminNote: string | null;
    }>;
}

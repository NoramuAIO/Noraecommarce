import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class TicketsService {
    private prisma;
    private mailService;
    private notificationsService;
    constructor(prisma: PrismaService, mailService: MailService, notificationsService: NotificationsService);
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
    findByUser(userId: number): Promise<({
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
    findById(id: number): Promise<{
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
    create(userId: number, data: {
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
    updateStatus(id: number, status: string): Promise<{
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
    updateAdminNote(id: number, adminNote: string): Promise<{
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
    addReply(ticketId: number, message: string, isAdmin: boolean, adminName?: string): Promise<{
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
    close(id: number): Promise<{
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

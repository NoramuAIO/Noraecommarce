import { PrismaService } from '../prisma/prisma.service';
export declare class LiveChatService {
    private prisma;
    constructor(prisma: PrismaService);
    createChat(data: {
        userName?: string;
        userEmail?: string;
        userId?: number;
    }): Promise<{
        messages: {
            id: number;
            createdAt: Date;
            content: string;
            isAdmin: boolean;
            adminName: string | null;
            chatId: number;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    }>;
    findBySessionId(sessionId: string): Promise<{
        messages: {
            id: number;
            createdAt: Date;
            content: string;
            isAdmin: boolean;
            adminName: string | null;
            chatId: number;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    }>;
    findAllActive(): Promise<({
        messages: {
            id: number;
            createdAt: Date;
            content: string;
            isAdmin: boolean;
            adminName: string | null;
            chatId: number;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    })[]>;
    findAll(): Promise<({
        messages: {
            id: number;
            createdAt: Date;
            content: string;
            isAdmin: boolean;
            adminName: string | null;
            chatId: number;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    })[]>;
    findById(id: number): Promise<{
        messages: {
            id: number;
            createdAt: Date;
            content: string;
            isAdmin: boolean;
            adminName: string | null;
            chatId: number;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    }>;
    sendMessage(chatId: number, content: string, isAdmin: boolean, adminName?: string): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        isAdmin: boolean;
        adminName: string | null;
        chatId: number;
    }>;
    sendMessageBySession(sessionId: string, content: string, isAdmin: boolean, adminName?: string): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        isAdmin: boolean;
        adminName: string | null;
        chatId: number;
    }>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    }>;
    closeChat(id: number): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    }>;
    getWaitingCount(): Promise<number>;
    delete(id: number): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    }>;
}

import { LiveChatService } from './livechat.service';
export declare class LiveChatController {
    private liveChatService;
    constructor(liveChatService: LiveChatService);
    startChat(body: {
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
    getBySession(sessionId: string): Promise<{
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
    sendMessageBySession(sessionId: string, body: {
        content: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        isAdmin: boolean;
        adminName: string | null;
        chatId: number;
    }>;
    getActiveChats(): Promise<({
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
    getAllChats(): Promise<({
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
    getWaitingCount(): Promise<{
        count: number;
    }>;
    getChatById(id: string): Promise<{
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
    sendAdminMessage(id: string, body: {
        content: string;
    }, req: any): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        isAdmin: boolean;
        adminName: string | null;
        chatId: number;
    }>;
    closeChat(id: string): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        userName: string | null;
        sessionId: string;
        userEmail: string | null;
    }>;
    deleteChat(id: string): Promise<{
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

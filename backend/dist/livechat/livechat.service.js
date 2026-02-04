"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let LiveChatService = class LiveChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChat(data) {
        const sessionId = (0, uuid_1.v4)();
        return this.prisma.liveChat.create({
            data: {
                sessionId,
                userName: data.userName,
                userEmail: data.userEmail,
                userId: data.userId,
                status: 'waiting',
            },
            include: { messages: true },
        });
    }
    async findBySessionId(sessionId) {
        return this.prisma.liveChat.findUnique({
            where: { sessionId },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
    }
    async findAllActive() {
        return this.prisma.liveChat.findMany({
            where: { status: { in: ['waiting', 'active'] } },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findAll() {
        return this.prisma.liveChat.findMany({
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.liveChat.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
    }
    async sendMessage(chatId, content, isAdmin, adminName) {
        const message = await this.prisma.liveChatMessage.create({
            data: {
                chatId,
                content,
                isAdmin,
                adminName,
            },
        });
        await this.prisma.liveChat.update({
            where: { id: chatId },
            data: {
                status: isAdmin ? 'active' : undefined,
                updatedAt: new Date()
            },
        });
        return message;
    }
    async sendMessageBySession(sessionId, content, isAdmin, adminName) {
        const chat = await this.findBySessionId(sessionId);
        if (!chat)
            throw new Error('Chat bulunamadı');
        return this.sendMessage(chat.id, content, isAdmin, adminName);
    }
    async updateStatus(id, status) {
        return this.prisma.liveChat.update({
            where: { id },
            data: { status },
        });
    }
    async closeChat(id) {
        return this.updateStatus(id, 'closed');
    }
    async getWaitingCount() {
        return this.prisma.liveChat.count({
            where: { status: 'waiting' },
        });
    }
    async delete(id) {
        return this.prisma.liveChat.delete({ where: { id } });
    }
};
exports.LiveChatService = LiveChatService;
exports.LiveChatService = LiveChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LiveChatService);
//# sourceMappingURL=livechat.service.js.map
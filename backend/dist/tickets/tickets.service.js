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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
let TicketsService = class TicketsService {
    constructor(prisma, mailService, notificationsService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.notificationsService = notificationsService;
    }
    async findAll() {
        return this.prisma.ticket.findMany({
            include: { user: { select: { id: true, name: true, email: true } }, replies: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUser(userId) {
        return this.prisma.ticket.findMany({
            where: { userId },
            include: { replies: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: { user: { select: { id: true, name: true, email: true } }, replies: true },
        });
        return ticket;
    }
    async create(userId, data) {
        const ticket = await this.prisma.ticket.create({
            data: { ...data, userId },
            include: { replies: true, user: { select: { email: true, name: true } } },
        });
        this.mailService.sendTicketCreated({ email: ticket.user.email, name: ticket.user.name }, { id: ticket.id, subject: ticket.subject });
        this.notificationsService.notifyTicket({
            id: ticket.id,
            subject: ticket.subject,
            userName: ticket.user.name,
            userEmail: ticket.user.email,
            priority: data.priority,
        }).catch(err => console.error('Webhook bildirim hatası:', err));
        return ticket;
    }
    async updateStatus(id, status) {
        return this.prisma.ticket.update({ where: { id }, data: { status } });
    }
    async updateAdminNote(id, adminNote) {
        return this.prisma.ticket.update({ where: { id }, data: { adminNote } });
    }
    async addReply(ticketId, message, isAdmin, adminName) {
        await this.prisma.ticketReply.create({
            data: { ticketId, message, isAdmin, adminName },
        });
        const ticket = await this.findById(ticketId);
        if (isAdmin && ticket?.user) {
            this.mailService.sendTicketReply({ email: ticket.user.email, name: ticket.user.name }, { id: ticket.id, subject: ticket.subject }, message);
            await this.prisma.ticket.update({ where: { id: ticketId }, data: { status: 'answered' } });
        }
        return this.findById(ticketId);
    }
    async close(id) {
        return this.prisma.ticket.update({ where: { id }, data: { status: 'closed' } });
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        notifications_service_1.NotificationsService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map
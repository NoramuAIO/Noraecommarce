import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll() {
    return this.prisma.ticket.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, replies: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: { replies: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } }, replies: true },
    });
    return ticket;
  }

  async create(userId: number, data: { subject: string; message: string; category: string; priority?: string }) {
    const ticket = await this.prisma.ticket.create({
      data: { ...data, userId },
      include: { replies: true, user: { select: { email: true, name: true } } },
    });

    // E-posta bildirimi gönder
    this.mailService.sendTicketCreated(
      { email: ticket.user.email, name: ticket.user.name },
      { id: ticket.id, subject: ticket.subject }
    );

    // Webhook bildirimi gönder (Discord/Telegram)
    this.notificationsService.notifyTicket({
      id: ticket.id,
      subject: ticket.subject,
      userName: ticket.user.name,
      userEmail: ticket.user.email,
      priority: data.priority,
    }).catch(err => console.error('Webhook bildirim hatası:', err));

    return ticket;
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.ticket.update({ where: { id }, data: { status } });
  }

  async updateAdminNote(id: number, adminNote: string) {
    return this.prisma.ticket.update({ where: { id }, data: { adminNote } });
  }

  async addReply(ticketId: number, message: string, isAdmin: boolean, adminName?: string) {
    await this.prisma.ticketReply.create({
      data: { ticketId, message, isAdmin, adminName },
    });

    const ticket = await this.findById(ticketId);

    // Admin yanıtı ise kullanıcıya e-posta gönder
    if (isAdmin && ticket?.user) {
      this.mailService.sendTicketReply(
        { email: ticket.user.email, name: ticket.user.name },
        { id: ticket.id, subject: ticket.subject },
        message
      );
      
      // Durumu "answered" olarak güncelle
      await this.prisma.ticket.update({ where: { id: ticketId }, data: { status: 'answered' } });
    }

    return this.findById(ticketId);
  }

  async close(id: number) {
    return this.prisma.ticket.update({ where: { id }, data: { status: 'closed' } });
  }
}

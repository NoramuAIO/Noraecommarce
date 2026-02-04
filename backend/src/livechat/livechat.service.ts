import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LiveChatService {
  constructor(private prisma: PrismaService) {}

  // Yeni chat başlat
  async createChat(data: { userName?: string; userEmail?: string; userId?: number }) {
    const sessionId = uuidv4();
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

  // Session ID ile chat bul
  async findBySessionId(sessionId: string) {
    return this.prisma.liveChat.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  // Tüm aktif chatler (admin için)
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

  // Tüm chatler (admin için)
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

  // Chat detayı
  async findById(id: number) {
    return this.prisma.liveChat.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  // Mesaj gönder
  async sendMessage(chatId: number, content: string, isAdmin: boolean, adminName?: string) {
    const message = await this.prisma.liveChatMessage.create({
      data: {
        chatId,
        content,
        isAdmin,
        adminName,
      },
    });

    // Chat'i güncelle
    await this.prisma.liveChat.update({
      where: { id: chatId },
      data: { 
        status: isAdmin ? 'active' : undefined,
        updatedAt: new Date() 
      },
    });

    return message;
  }

  // Session ID ile mesaj gönder
  async sendMessageBySession(sessionId: string, content: string, isAdmin: boolean, adminName?: string) {
    const chat = await this.findBySessionId(sessionId);
    if (!chat) throw new Error('Chat bulunamadı');
    return this.sendMessage(chat.id, content, isAdmin, adminName);
  }

  // Chat durumunu güncelle
  async updateStatus(id: number, status: string) {
    return this.prisma.liveChat.update({
      where: { id },
      data: { status },
    });
  }

  // Chat'i kapat
  async closeChat(id: number) {
    return this.updateStatus(id, 'closed');
  }

  // Bekleyen chat sayısı
  async getWaitingCount() {
    return this.prisma.liveChat.count({
      where: { status: 'waiting' },
    });
  }

  // Chat sil
  async delete(id: number) {
    return this.prisma.liveChat.delete({ where: { id } });
  }
}

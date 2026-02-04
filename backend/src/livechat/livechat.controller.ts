import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LiveChatService } from './livechat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('livechat')
export class LiveChatController {
  constructor(private liveChatService: LiveChatService) {}

  // Yeni chat başlat (public)
  @Post('start')
  async startChat(@Body() body: { userName?: string; userEmail?: string; userId?: number }) {
    return this.liveChatService.createChat(body);
  }

  // Session ile chat getir (public)
  @Get('session/:sessionId')
  async getBySession(@Param('sessionId') sessionId: string) {
    return this.liveChatService.findBySessionId(sessionId);
  }

  // Session ile mesaj gönder (public)
  @Post('session/:sessionId/message')
  async sendMessageBySession(
    @Param('sessionId') sessionId: string,
    @Body() body: { content: string }
  ) {
    return this.liveChatService.sendMessageBySession(sessionId, body.content, false);
  }

  // Admin: Tüm aktif chatler
  @UseGuards(JwtAuthGuard)
  @Get('admin/active')
  async getActiveChats() {
    return this.liveChatService.findAllActive();
  }

  // Admin: Tüm chatler
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async getAllChats() {
    return this.liveChatService.findAll();
  }

  // Admin: Bekleyen chat sayısı
  @UseGuards(JwtAuthGuard)
  @Get('admin/waiting-count')
  async getWaitingCount() {
    const count = await this.liveChatService.getWaitingCount();
    return { count };
  }

  // Admin: Chat detayı
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async getChatById(@Param('id') id: string) {
    return this.liveChatService.findById(+id);
  }

  // Admin: Mesaj gönder
  @UseGuards(JwtAuthGuard)
  @Post('admin/:id/message')
  async sendAdminMessage(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Request() req: any
  ) {
    return this.liveChatService.sendMessage(+id, body.content, true, req.user.name || 'Admin');
  }

  // Admin: Chat'i kapat
  @UseGuards(JwtAuthGuard)
  @Put('admin/:id/close')
  async closeChat(@Param('id') id: string) {
    return this.liveChatService.closeChat(+id);
  }

  // Admin: Chat sil
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  async deleteChat(@Param('id') id: string) {
    return this.liveChatService.delete(+id);
  }
}

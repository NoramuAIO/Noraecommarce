import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface NotificationData {
  type: 'order' | 'free_order' | 'price_change' | 'product_update' | 'new_user' | 'ticket';
  title: string;
  description: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  color?: number;
  url?: string;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  private async getSettings() {
    const settings = await this.prisma.settings.findMany({
      where: {
        key: {
          in: [
            'discordWebhookUrl',
            'telegramBotToken',
            'telegramChatId',
            'notifyDiscordOrder',
            'notifyDiscordFreeOrder',
            'notifyDiscordPriceChange',
            'notifyDiscordProductUpdate',
            'notifyDiscordNewUser',
            'notifyDiscordTicket',
            'notifyTelegramOrder',
            'notifyTelegramFreeOrder',
            'notifyTelegramPriceChange',
            'notifyTelegramProductUpdate',
            'notifyTelegramNewUser',
            'notifyTelegramTicket',
          ]
        }
      }
    });
    
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  }

  // Discord Webhook gönder
  private async sendDiscordWebhook(data: NotificationData): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const webhookUrl = settings.discordWebhookUrl;
      
      if (!webhookUrl) {
        console.log('Discord webhook URL ayarlanmamış');
        return false;
      }

      // Bildirim türü kontrolü
      const notifyKey = `notifyDiscord${this.capitalizeType(data.type)}`;
      if (settings[notifyKey] === 'false') {
        console.log(`Discord ${data.type} bildirimi kapalı`);
        return false;
      }

      const embed = {
        title: data.title,
        description: data.description,
        color: data.color || this.getColorForType(data.type),
        fields: data.fields || [],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Noramu Bildirim Sistemi'
        }
      };

      if (data.url) {
        (embed as any).url = data.url;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });

      if (response.ok) {
        console.log('Discord webhook gönderildi');
        return true;
      } else {
        const error = await response.text();
        console.error('Discord webhook hatası:', error);
        return false;
      }
    } catch (error) {
      console.error('Discord webhook hatası:', error);
      return false;
    }
  }

  // Telegram mesajı gönder
  private async sendTelegramMessage(data: NotificationData): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const botToken = settings.telegramBotToken;
      const chatId = settings.telegramChatId;
      
      if (!botToken || !chatId) {
        console.log('Telegram ayarları eksik');
        return false;
      }

      // Bildirim türü kontrolü
      const notifyKey = `notifyTelegram${this.capitalizeType(data.type)}`;
      if (settings[notifyKey] === 'false') {
        console.log(`Telegram ${data.type} bildirimi kapalı`);
        return false;
      }

      // Telegram mesaj formatı
      let message = `*${this.escapeMarkdown(data.title)}*\n\n`;
      message += `${this.escapeMarkdown(data.description)}\n`;
      
      if (data.fields && data.fields.length > 0) {
        message += '\n';
        for (const field of data.fields) {
          message += `*${this.escapeMarkdown(field.name)}:* ${this.escapeMarkdown(field.value)}\n`;
        }
      }

      if (data.url) {
        message += `\n[Detaylar](${data.url})`;
      }

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true
          })
        }
      );

      if (response.ok) {
        console.log('Telegram mesajı gönderildi');
        return true;
      } else {
        const error = await response.json();
        console.error('Telegram hatası:', error);
        return false;
      }
    } catch (error) {
      console.error('Telegram hatası:', error);
      return false;
    }
  }

  private escapeMarkdown(text: string): string {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
  }

  private capitalizeType(type: string): string {
    const map: Record<string, string> = {
      'order': 'Order',
      'free_order': 'FreeOrder',
      'price_change': 'PriceChange',
      'product_update': 'ProductUpdate',
      'new_user': 'NewUser',
      'ticket': 'Ticket'
    };
    return map[type] || type;
  }

  private getColorForType(type: string): number {
    const colors: Record<string, number> = {
      'order': 0x22c55e,        // Yeşil - satış
      'free_order': 0x3b82f6,   // Mavi - ücretsiz
      'price_change': 0xf59e0b, // Turuncu - fiyat
      'product_update': 0x8b5cf6, // Mor - güncelleme
      'new_user': 0x06b6d4,     // Cyan - yeni kullanıcı
      'ticket': 0xef4444        // Kırmızı - destek
    };
    return colors[type] || 0x8b5cf6;
  }

  // Public metodlar - diğer servislerden çağrılacak

  async notifyOrder(order: {
    id: number;
    productName: string;
    userName: string;
    userEmail: string;
    amount: number;
  }): Promise<void> {
    const data: NotificationData = {
      type: 'order',
      title: '💰 Yeni Satış!',
      description: `${order.productName} ürünü satıldı.`,
      fields: [
        { name: 'Sipariş No', value: `#${order.id}`, inline: true },
        { name: 'Tutar', value: `₺${order.amount}`, inline: true },
        { name: 'Müşteri', value: order.userName, inline: true },
        { name: 'E-posta', value: order.userEmail, inline: false }
      ]
    };

    await Promise.all([
      this.sendDiscordWebhook(data),
      this.sendTelegramMessage(data)
    ]);
  }

  async notifyFreeOrder(order: {
    id: number;
    productName: string;
    userName: string;
    userEmail: string;
  }): Promise<void> {
    const data: NotificationData = {
      type: 'free_order',
      title: '🎁 Ücretsiz Ürün Alındı',
      description: `${order.productName} ücretsiz ürünü alındı.`,
      fields: [
        { name: 'Sipariş No', value: `#${order.id}`, inline: true },
        { name: 'Müşteri', value: order.userName, inline: true },
        { name: 'E-posta', value: order.userEmail, inline: false }
      ]
    };

    await Promise.all([
      this.sendDiscordWebhook(data),
      this.sendTelegramMessage(data)
    ]);
  }

  async notifyPriceChange(product: {
    id: number;
    name: string;
    oldPrice: number;
    newPrice: number;
    changedBy: string;
  }): Promise<void> {
    const priceDirection = product.newPrice > product.oldPrice ? '📈' : '📉';
    const data: NotificationData = {
      type: 'price_change',
      title: `${priceDirection} Fiyat Değişikliği`,
      description: `${product.name} ürününün fiyatı değişti.`,
      fields: [
        { name: 'Eski Fiyat', value: `₺${product.oldPrice}`, inline: true },
        { name: 'Yeni Fiyat', value: `₺${product.newPrice}`, inline: true },
        { name: 'Değiştiren', value: product.changedBy, inline: true }
      ]
    };

    await Promise.all([
      this.sendDiscordWebhook(data),
      this.sendTelegramMessage(data)
    ]);
  }

  async notifyProductUpdate(product: {
    id: number;
    name: string;
    updateType: string;
    details: string;
    updatedBy: string;
  }): Promise<void> {
    const data: NotificationData = {
      type: 'product_update',
      title: '🔄 Ürün Güncellendi',
      description: `${product.name} ürünü güncellendi.`,
      fields: [
        { name: 'Güncelleme', value: product.updateType, inline: true },
        { name: 'Detay', value: product.details, inline: false },
        { name: 'Güncelleyen', value: product.updatedBy, inline: true }
      ]
    };

    await Promise.all([
      this.sendDiscordWebhook(data),
      this.sendTelegramMessage(data)
    ]);
  }

  async notifyNewUser(user: {
    id: number;
    name: string;
    email: string;
    provider?: string;
  }): Promise<void> {
    const data: NotificationData = {
      type: 'new_user',
      title: '👤 Yeni Kullanıcı',
      description: `Yeni bir kullanıcı kayıt oldu.`,
      fields: [
        { name: 'İsim', value: user.name, inline: true },
        { name: 'E-posta', value: user.email, inline: true },
        { name: 'Kayıt Yöntemi', value: user.provider || 'E-posta', inline: true }
      ]
    };

    await Promise.all([
      this.sendDiscordWebhook(data),
      this.sendTelegramMessage(data)
    ]);
  }

  async notifyTicket(ticket: {
    id: number;
    subject: string;
    userName: string;
    userEmail: string;
    priority?: string;
  }): Promise<void> {
    const data: NotificationData = {
      type: 'ticket',
      title: '🎫 Yeni Destek Talebi',
      description: `Yeni bir destek talebi oluşturuldu.`,
      fields: [
        { name: 'Talep No', value: `#${ticket.id}`, inline: true },
        { name: 'Konu', value: ticket.subject, inline: false },
        { name: 'Kullanıcı', value: ticket.userName, inline: true },
        { name: 'E-posta', value: ticket.userEmail, inline: true }
      ]
    };

    await Promise.all([
      this.sendDiscordWebhook(data),
      this.sendTelegramMessage(data)
    ]);
  }

  // Test bildirimi
  async sendTestNotification(platform: 'discord' | 'telegram'): Promise<boolean> {
    const data: NotificationData = {
      type: 'order',
      title: '🧪 Test Bildirimi',
      description: 'Bu bir test bildirimidir. Bildirim sistemi çalışıyor!',
      fields: [
        { name: 'Platform', value: platform === 'discord' ? 'Discord' : 'Telegram', inline: true },
        { name: 'Tarih', value: new Date().toLocaleString('tr-TR'), inline: true }
      ]
    };

    if (platform === 'discord') {
      return this.sendDiscordWebhook(data);
    } else {
      return this.sendTelegramMessage(data);
    }
  }
}

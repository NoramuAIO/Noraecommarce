import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getUserFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addFavorite(userId: number, productId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) return existing;

    return this.prisma.favorite.create({
      data: { userId, productId },
    });
  }

  async removeFavorite(userId: number, productId: number) {
    return this.prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async isFavorite(userId: number, productId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!favorite;
  }

  async getProductFavoriteUsers(productId: number) {
    return this.prisma.favorite.findMany({
      where: { productId },
      include: { user: true },
    });
  }

  // Ürün güncellendiğinde favori kullanıcılara bildirim gönder
  async notifyFavoriteUsers(
    productId: number,
    type: string,
    message: string,
    oldValue?: string,
    newValue?: string,
  ) {
    const favorites = await this.getProductFavoriteUsers(productId);
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    // Ayarlardan e-posta şablonunu al
    const settings = await this.prisma.settings.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });

    const siteName = settingsMap.siteName || 'Noramu';
    const siteUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    for (const fav of favorites) {
      // Bildirim oluştur
      await this.prisma.productNotification.create({
        data: {
          userId: fav.userId,
          productId,
          type,
          message,
          oldValue,
          newValue,
        },
      });

      // E-posta gönder - özelleştirilmiş şablon kullan
      try {
        const emailSubject = (settingsMap.email_favorite_update_subject || 'Favori Ürününüz Güncellendi: {{product_name}} ❤️')
          .replace(/\{\{site_name\}\}/g, siteName)
          .replace(/\{\{product_name\}\}/g, product?.name || '')
          .replace(/\{\{user_name\}\}/g, fav.user.name);

        let emailHtml = settingsMap.email_favorite_update_html || `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px;">
            <h2 style="color: #8B5CF6; text-align: center;">{{site_name}}</h2>
            <h3 style="color: #fff; text-align: center;">Favori Ürün Güncellendi ❤️</h3>
            <p style="color: #ccc;">Merhaba <strong>{{user_name}}</strong>,</p>
            <p style="color: #ccc;">Favori listenizde bulunan <strong style="color: #8B5CF6;">{{product_name}}</strong> ürünü güncellendi.</p>
            <div style="background: #252525; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #fff;"><strong>Değişiklik:</strong> {{change_message}}</p>
              {{#if old_value}}<p style="margin: 5px 0 0 0; color: #ef4444;"><strong>Eski:</strong> {{old_value}}</p>{{/if}}
              {{#if new_value}}<p style="margin: 5px 0 0 0; color: #22c55e;"><strong>Yeni:</strong> {{new_value}}</p>{{/if}}
            </div>
            <center>
              <a href="{{site_url}}/products/{{product_id}}" style="display: inline-block; background: linear-gradient(to right, #8B5CF6, #d946ef); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Ürünü İncele</a>
            </center>
          </div>
        `;

        // Değişkenleri değiştir
        emailHtml = emailHtml
          .replace(/\{\{site_name\}\}/g, siteName)
          .replace(/\{\{site_url\}\}/g, siteUrl)
          .replace(/\{\{user_name\}\}/g, fav.user.name)
          .replace(/\{\{user_email\}\}/g, fav.user.email)
          .replace(/\{\{product_name\}\}/g, product?.name || '')
          .replace(/\{\{product_id\}\}/g, String(productId))
          .replace(/\{\{change_message\}\}/g, message)
          .replace(/\{\{old_value\}\}/g, oldValue || '')
          .replace(/\{\{new_value\}\}/g, newValue || '')
          .replace(/\{\{#if old_value\}\}/g, oldValue ? '' : '<!--')
          .replace(/\{\{#if new_value\}\}/g, newValue ? '' : '<!--')
          .replace(/\{\{\/if\}\}/g, oldValue || newValue ? '' : '-->');

        await this.mailService.sendMail(fav.user.email, emailSubject, emailHtml);
      } catch (error) {
        console.error('Favori bildirim maili gönderilemedi:', error);
      }
    }
  }

  // Kullanıcının bildirimlerini getir
  async getUserNotifications(userId: number) {
    return this.prisma.productNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  // Bildirimi okundu olarak işaretle
  async markNotificationRead(notificationId: number, userId: number) {
    return this.prisma.productNotification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  // Tüm bildirimleri okundu olarak işaretle
  async markAllNotificationsRead(userId: number) {
    return this.prisma.productNotification.updateMany({
      where: { userId },
      data: { read: true },
    });
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { DiscordService } from '../discord/discord.service';
import { NotificationsService } from '../notifications/notifications.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private discordService: DiscordService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { user: true, product: true },
    });
  }

  async create(userId: number, productId: number, paymentMethod: string, couponCode?: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new BadRequestException('Ürün bulunamadı');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Kullanıcı bulunamadı');

    // Ücretsiz ürün kontrolü
    const isFree = product.price === 0 || paymentMethod === 'free';

    // Kupon doğrulama ve indirim hesaplama
    let finalPrice = product.price;
    let couponId: number | null = null;
    
    if (couponCode && !isFree) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: couponCode } });
      
      if (!coupon) {
        throw new BadRequestException('Kupon bulunamadı');
      }
      
      if (!coupon.active) {
        throw new BadRequestException('Kupon deaktif');
      }
      
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        throw new BadRequestException('Kupon süresi dolmuş');
      }
      
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new BadRequestException('Kupon kullanım limiti aşıldı');
      }

      // İndirim hesapla
      if (coupon.discountType === 'percentage') {
        finalPrice = product.price * (1 - coupon.discountValue / 100);
      } else {
        finalPrice = Math.max(0, product.price - coupon.discountValue);
      }
      
      couponId = coupon.id;
    }

    // Bakiye kontrolü (ücretsiz değilse)
    if (!isFree && paymentMethod === 'balance') {
      if (user.balance < finalPrice) {
        throw new BadRequestException('Yetersiz bakiye');
      }
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Transaction ile sipariş oluştur ve bakiyeyi düş
    const order = await this.prisma.$transaction(async (tx) => {
      // Bakiyeden düş (ücretsiz değilse)
      if (!isFree && paymentMethod === 'balance') {
        await tx.user.update({
          where: { id: userId },
          data: { balance: { decrement: finalPrice } },
        });
      }

      // Sipariş oluştur
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          amount: finalPrice,
          originalAmount: product.price,
          discountAmount: product.price - finalPrice,
          paymentMethod: isFree ? 'free' : paymentMethod,
          status: (isFree || paymentMethod === 'balance') ? 'completed' : 'pending',
          userId,
          productId,
          couponId,
        },
        include: { product: true },
      });

      // Kupon kullanım sayısını artır
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Ücretsiz veya bakiye ile ödeme yapıldıysa indirme sayısını artır
      if (isFree || paymentMethod === 'balance') {
        // İndirme sayısını artır
        await tx.product.update({
          where: { id: productId },
          data: { downloads: { increment: 1 } },
        });
      }

      return newOrder;
    });

    const result = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: { product: true },
    });

    // E-posta bildirimi gönder
    this.mailService.sendOrderConfirmation(
      { email: user.email, name: user.name },
      { orderNumber, amount: finalPrice, product: { name: product.name } }
    );

    // Discord rol ver (arka planda)
    const isPaidProduct = product.price > 0;
    this.discordService.handleOrderCompleted(userId, isPaidProduct, productId).catch(err => {
      console.error('Discord rol verme hatası:', err);
    });

    // Webhook bildirimi gönder (Discord/Telegram)
    if (isFree) {
      this.notificationsService.notifyFreeOrder({
        id: order.id,
        productName: product.name,
        userName: user.name,
        userEmail: user.email,
      }).catch(err => console.error('Webhook bildirim hatası:', err));
    } else {
      this.notificationsService.notifyOrder({
        id: order.id,
        productName: product.name,
        userName: user.name,
        userEmail: user.email,
        amount: finalPrice,
      }).catch(err => console.error('Webhook bildirim hatası:', err));
    }

    return result;
  }

  async updateStatus(id: number, status: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { product: true },
    });

    return order;
  }
}

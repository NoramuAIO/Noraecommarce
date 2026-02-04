import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxUses?: number;
    expiresAt?: Date;
    usableInCart?: boolean;
    productIds?: number[];
  }) {
    // Kupon kodu zaten var mı kontrol et
    const existing = await this.prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existing) {
      throw new BadRequestException('Bu kupon kodu zaten kullanılıyor');
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses,
        expiresAt: data.expiresAt,
        usableInCart: data.usableInCart ?? false,
        products: data.productIds
          ? {
              connect: data.productIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: { products: true },
    });

    return coupon;
  }

  async getAll() {
    return this.prisma.coupon.findMany({
      include: { products: true, orders: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { products: true, orders: true },
    });

    if (!coupon) {
      throw new NotFoundException('Kupon bulunamadı');
    }

    return coupon;
  }

  async update(
    id: number,
    data: {
      description?: string;
      discountType?: 'percentage' | 'fixed';
      discountValue?: number;
      maxUses?: number;
      expiresAt?: Date;
      active?: boolean;
      usableInCart?: boolean;
      productIds?: number[];
    }
  ) {
    const coupon = await this.getById(id);

    return this.prisma.coupon.update({
      where: { id },
      data: {
        description: data.description ?? coupon.description,
        discountType: data.discountType ?? coupon.discountType,
        discountValue: data.discountValue ?? coupon.discountValue,
        maxUses: data.maxUses ?? coupon.maxUses,
        expiresAt: data.expiresAt ?? coupon.expiresAt,
        active: data.active ?? coupon.active,
        usableInCart: data.usableInCart ?? coupon.usableInCart,
        products: data.productIds
          ? {
              set: data.productIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: { products: true },
    });
  }

  async delete(id: number) {
    await this.getById(id);
    return this.prisma.coupon.delete({ where: { id } });
  }

  async validate(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { products: true },
    });

    if (!coupon) {
      throw new BadRequestException('Geçersiz kupon kodu');
    }

    if (!coupon.active) {
      throw new BadRequestException('Bu kupon devre dışı bırakılmıştır');
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new BadRequestException('Bu kuponun süresi dolmuştur');
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Bu kupon maksimum kullanım sayısına ulaşmıştır');
    }

    return coupon;
  }

  async calculateDiscount(couponCode: string, productId: number | null, amount: number) {
    const coupon = await this.validate(couponCode);

    // Sepet kuponuysa (productId null) usableInCart kontrolü yap
    if (productId === null && !coupon.usableInCart) {
      throw new BadRequestException('Bu kupon sepette kullanılamaz');
    }

    // Kupon bu ürüne uygulanabilir mi kontrol et (productId null ise sepet kuponudur, tüm ürünlere uygulanır)
    if (productId !== null) {
      const isApplicable = coupon.products.some(p => p.id === productId);
      if (!isApplicable) {
        throw new BadRequestException('Bu kupon bu ürüne uygulanamaz');
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (amount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    return {
      coupon,
      discountAmount,
      finalAmount,
    };
  }

  async useCoupon(couponId: number) {
    return this.prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }
}

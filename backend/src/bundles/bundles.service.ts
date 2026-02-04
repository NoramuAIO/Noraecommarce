import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BundlesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    applyTo: 'category' | 'products';
    expiresAt?: Date | string;
    categoryId?: number;
    productIds?: number[];
  }) {
    const bundle = await this.prisma.bundle.create({
      data: {
        name: data.name,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        applyTo: data.applyTo,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        categoryId: data.categoryId,
        products: data.productIds
          ? {
              connect: data.productIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: { category: true, products: true },
    });

    return bundle;
  }

  async getAll() {
    return this.prisma.bundle.findMany({
      include: { category: true, products: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: number) {
    const bundle = await this.prisma.bundle.findUnique({
      where: { id },
      include: { category: true, products: true },
    });

    if (!bundle) {
      throw new NotFoundException('Bundle bulunamadı');
    }

    return bundle;
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      discountType?: 'percentage' | 'fixed';
      discountValue?: number;
      applyTo?: 'category' | 'products';
      expiresAt?: Date | string;
      active?: boolean;
      categoryId?: number;
      productIds?: number[];
    }
  ) {
    const bundle = await this.getById(id);

    return this.prisma.bundle.update({
      where: { id },
      data: {
        name: data.name ?? bundle.name,
        description: data.description ?? bundle.description,
        discountType: data.discountType ?? bundle.discountType,
        discountValue: data.discountValue ?? bundle.discountValue,
        applyTo: data.applyTo ?? bundle.applyTo,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : bundle.expiresAt,
        active: data.active ?? bundle.active,
        categoryId: data.categoryId ?? bundle.categoryId,
        products: data.productIds
          ? {
              set: data.productIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: { category: true, products: true },
    });
  }

  async delete(id: number) {
    await this.getById(id);
    return this.prisma.bundle.delete({ where: { id } });
  }

  async validate(bundleId: number) {
    const bundle = await this.getById(bundleId);

    if (!bundle.active) {
      throw new BadRequestException('Bu bundle devre dışı bırakılmıştır');
    }

    if (bundle.expiresAt && new Date() > bundle.expiresAt) {
      throw new BadRequestException('Bu bundlenin süresi dolmuştur');
    }

    return bundle;
  }

  async calculateDiscount(bundleId: number, productId: number, amount: number) {
    const bundle = await this.validate(bundleId);

    // Bundle bu ürüne uygulanabilir mi kontrol et
    if (bundle.applyTo === 'products') {
      const isApplicable = bundle.products.some(p => p.id === productId);
      if (!isApplicable) {
        throw new BadRequestException('Bu bundle bu ürüne uygulanamaz');
      }
    } else if (bundle.applyTo === 'category') {
      // Ürünün kategorisini kontrol et
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product || product.categoryId !== bundle.categoryId) {
        throw new BadRequestException('Bu bundle bu ürüne uygulanamaz');
      }
    }

    let discountAmount = 0;
    if (bundle.discountType === 'percentage') {
      discountAmount = (amount * bundle.discountValue) / 100;
    } else {
      discountAmount = bundle.discountValue;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    return {
      bundle,
      discountAmount,
      finalAmount,
    };
  }
}

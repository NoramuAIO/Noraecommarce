import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: number, includeFree: boolean = true) {
    const where: any = { status: 'active' };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    // Ücretsiz ürünleri hariç tut (varsayılan olarak)
    if (!includeFree) {
      where.price = { gt: 0 };
    }
    return this.prisma.product.findMany({
      where,
      include: { 
        category: true,
        _count: { select: { favorites: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Sadece ücretsiz ürünleri getir
  async findFree() {
    return this.prisma.product.findMany({
      where: { status: 'active', price: 0 },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Sadece ücretli ürünleri getir
  async findPaid(categoryId?: number) {
    const where: any = { status: 'active', price: { gt: 0 } };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    return this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // En çok satan ürünleri getir
  async findBestSellers(limit: number = 8) {
    return this.prisma.product.findMany({
      where: { status: 'active' },
      include: { category: true },
      orderBy: { downloads: 'desc' },
      take: limit,
    });
  }

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { 
        category: true,
        changelogs: { orderBy: { createdAt: 'desc' }, take: 10 },
        productReviews: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
        _count: { select: { favorites: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { 
        category: true,
        changelogs: { orderBy: { createdAt: 'desc' }, take: 10 },
        productReviews: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.product.create({
      data: { ...data, slug },
      include: { category: true },
    });
  }

  async update(id: number, data: any, notifyFavorites?: (productId: number, type: string, message: string, oldValue?: string, newValue?: string) => Promise<void>) {
    // Önce mevcut ürünü al
    const oldProduct = await this.prisma.product.findUnique({ where: { id } });
    
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    // Favori kullanıcılara bildirim gönder
    if (notifyFavorites && oldProduct) {
      // Fiyat değişikliği
      if (data.price !== undefined && oldProduct.price !== data.price) {
        const priceChange = data.price < oldProduct.price ? 'düştü' : 'arttı';
        await notifyFavorites(
          id,
          'price_change',
          `Fiyat ${priceChange}!`,
          `₺${oldProduct.price}`,
          `₺${data.price}`
        );
      }

      // İsim değişikliği
      if (data.name && oldProduct.name !== data.name) {
        await notifyFavorites(
          id,
          'name_change',
          'Ürün adı değişti',
          oldProduct.name,
          data.name
        );
      }

      // Açıklama değişikliği
      if (data.description && oldProduct.description !== data.description) {
        await notifyFavorites(
          id,
          'description_change',
          'Ürün açıklaması güncellendi',
          undefined,
          undefined
        );
      }

      // Özellikler değişikliği
      if (data.features && oldProduct.features !== data.features) {
        await notifyFavorites(
          id,
          'feature_change',
          'Ürün özellikleri güncellendi',
          undefined,
          undefined
        );
      }
    }

    return updatedProduct;
  }

  async delete(id: number) {
    // Önce ilişkili kayıtları sil
    await this.prisma.$transaction(async (tx) => {
      // Favorileri sil
      await tx.favorite.deleteMany({ where: { productId: id } });
      
      // Bildirimleri sil
      await tx.productNotification.deleteMany({ where: { productId: id } });
      
      // Değerlendirmeleri sil
      await tx.productReview.deleteMany({ where: { productId: id } });
      
      // Changelog'ları sil
      await tx.productChangelog.deleteMany({ where: { productId: id } });
      
      // Siparişleri sil
      await tx.order.deleteMany({ where: { productId: id } });
      
      // Son olarak ürünü sil
      await tx.product.delete({ where: { id } });
    });
    
    return { success: true };
  }

  async incrementDownloads(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  }

  // Changelog methods
  async getChangelogs(productId: number) {
    return this.prisma.productChangelog.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createChangelog(productId: number, data: { version: string; changes: string[] }, notifyFavorites?: (productId: number, type: string, message: string, oldValue?: string, newValue?: string) => Promise<void>) {
    // Ürün versiyonunu da güncelle
    await this.prisma.product.update({
      where: { id: productId },
      data: { version: data.version },
    });
    
    const changelog = await this.prisma.productChangelog.create({
      data: {
        productId,
        version: data.version,
        changes: JSON.stringify(data.changes),
      },
    });

    // Favori kullanıcılara güncelleme bildirimi gönder
    if (notifyFavorites) {
      await notifyFavorites(
        productId,
        'update',
        `Yeni güncelleme yayınlandı: v${data.version}`,
        undefined,
        data.changes.slice(0, 2).join(', ')
      );
    }

    return changelog;
  }

  async deleteChangelog(id: number) {
    return this.prisma.productChangelog.delete({ where: { id } });
  }

  // Review methods
  async getReviews(productId: number, adminView = false) {
    const where = adminView ? { productId } : { productId, approved: true };
    return this.prisma.productReview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllReviewsAdmin() {
    return this.prisma.productReview.findMany({
      include: { product: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(productId: number, data: { rating: number; comment: string; userName: string }) {
    const review = await this.prisma.productReview.create({
      data: { ...data, productId },
    });
    
    // Ortalama puanı güncelle
    await this.updateProductRating(productId);
    return review;
  }

  async updateReview(id: number, data: { approved?: boolean }) {
    const review = await this.prisma.productReview.update({
      where: { id },
      data,
    });
    
    await this.updateProductRating(review.productId);
    return review;
  }

  async deleteReview(id: number) {
    const review = await this.prisma.productReview.findUnique({ where: { id } });
    await this.prisma.productReview.delete({ where: { id } });
    
    if (review) {
      await this.updateProductRating(review.productId);
    }
  }

  private async updateProductRating(productId: number) {
    const reviews = await this.prisma.productReview.findMany({
      where: { productId, approved: true },
    });
    
    if (reviews.length === 0) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { rating: 5.0, reviews: 0 },
      });
      return;
    }
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.prisma.product.update({
      where: { id: productId },
      data: { 
        rating: Math.round(avgRating * 10) / 10,
        reviews: reviews.length,
      },
    });
  }
}

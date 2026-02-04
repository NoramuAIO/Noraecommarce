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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(categoryId, includeFree = true) {
        const where = { status: 'active' };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (!includeFree) {
            where.price = { gt: 0 };
        }
        return this.prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findFree() {
        return this.prisma.product.findMany({
            where: { status: 'active', price: 0 },
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPaid(categoryId) {
        const where = { status: 'active', price: { gt: 0 } };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        return this.prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findBestSellers(limit = 8) {
        return this.prisma.product.findMany({
            where: { status: 'active' },
            include: { category: true },
            orderBy: { downloads: 'desc' },
            take: limit,
        });
    }
    async findById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                changelogs: { orderBy: { createdAt: 'desc' }, take: 10 },
                productReviews: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
            },
        });
    }
    async findBySlug(slug) {
        return this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                changelogs: { orderBy: { createdAt: 'desc' }, take: 10 },
                productReviews: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
            },
        });
    }
    async create(data) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return this.prisma.product.create({
            data: { ...data, slug },
            include: { category: true },
        });
    }
    async update(id, data, notifyFavorites) {
        const oldProduct = await this.prisma.product.findUnique({ where: { id } });
        if (data.name) {
            data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data,
            include: { category: true },
        });
        if (notifyFavorites && oldProduct) {
            if (data.price !== undefined && oldProduct.price !== data.price) {
                const priceChange = data.price < oldProduct.price ? 'düştü' : 'arttı';
                await notifyFavorites(id, 'price_change', `Fiyat ${priceChange}!`, `₺${oldProduct.price}`, `₺${data.price}`);
            }
            if (data.name && oldProduct.name !== data.name) {
                await notifyFavorites(id, 'name_change', 'Ürün adı değişti', oldProduct.name, data.name);
            }
            if (data.description && oldProduct.description !== data.description) {
                await notifyFavorites(id, 'description_change', 'Ürün açıklaması güncellendi', undefined, undefined);
            }
            if (data.features && oldProduct.features !== data.features) {
                await notifyFavorites(id, 'feature_change', 'Ürün özellikleri güncellendi', undefined, undefined);
            }
        }
        return updatedProduct;
    }
    async delete(id) {
        await this.prisma.$transaction(async (tx) => {
            await tx.favorite.deleteMany({ where: { productId: id } });
            await tx.productNotification.deleteMany({ where: { productId: id } });
            await tx.productReview.deleteMany({ where: { productId: id } });
            await tx.productChangelog.deleteMany({ where: { productId: id } });
            await tx.order.deleteMany({ where: { productId: id } });
            await tx.product.delete({ where: { id } });
        });
        return { success: true };
    }
    async incrementDownloads(id) {
        return this.prisma.product.update({
            where: { id },
            data: { downloads: { increment: 1 } },
        });
    }
    async getChangelogs(productId) {
        return this.prisma.productChangelog.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createChangelog(productId, data, notifyFavorites) {
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
        if (notifyFavorites) {
            await notifyFavorites(productId, 'update', `Yeni güncelleme yayınlandı: v${data.version}`, undefined, data.changes.slice(0, 2).join(', '));
        }
        return changelog;
    }
    async deleteChangelog(id) {
        return this.prisma.productChangelog.delete({ where: { id } });
    }
    async getReviews(productId, adminView = false) {
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
    async createReview(productId, data) {
        const review = await this.prisma.productReview.create({
            data: { ...data, productId },
        });
        await this.updateProductRating(productId);
        return review;
    }
    async updateReview(id, data) {
        const review = await this.prisma.productReview.update({
            where: { id },
            data,
        });
        await this.updateProductRating(review.productId);
        return review;
    }
    async deleteReview(id) {
        const review = await this.prisma.productReview.findUnique({ where: { id } });
        await this.prisma.productReview.delete({ where: { id } });
        if (review) {
            await this.updateProductRating(review.productId);
        }
    }
    async updateProductRating(productId) {
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map
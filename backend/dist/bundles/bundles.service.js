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
exports.BundlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BundlesService = class BundlesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async getById(id) {
        const bundle = await this.prisma.bundle.findUnique({
            where: { id },
            include: { category: true, products: true },
        });
        if (!bundle) {
            throw new common_1.NotFoundException('Bundle bulunamadı');
        }
        return bundle;
    }
    async update(id, data) {
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
    async delete(id) {
        await this.getById(id);
        return this.prisma.bundle.delete({ where: { id } });
    }
    async validate(bundleId) {
        const bundle = await this.getById(bundleId);
        if (!bundle.active) {
            throw new common_1.BadRequestException('Bu bundle devre dışı bırakılmıştır');
        }
        if (bundle.expiresAt && new Date() > bundle.expiresAt) {
            throw new common_1.BadRequestException('Bu bundlenin süresi dolmuştur');
        }
        return bundle;
    }
    async calculateDiscount(bundleId, productId, amount) {
        const bundle = await this.validate(bundleId);
        if (bundle.applyTo === 'products') {
            const isApplicable = bundle.products.some(p => p.id === productId);
            if (!isApplicable) {
                throw new common_1.BadRequestException('Bu bundle bu ürüne uygulanamaz');
            }
        }
        else if (bundle.applyTo === 'category') {
            const product = await this.prisma.product.findUnique({
                where: { id: productId },
            });
            if (!product || product.categoryId !== bundle.categoryId) {
                throw new common_1.BadRequestException('Bu bundle bu ürüne uygulanamaz');
            }
        }
        let discountAmount = 0;
        if (bundle.discountType === 'percentage') {
            discountAmount = (amount * bundle.discountValue) / 100;
        }
        else {
            discountAmount = bundle.discountValue;
        }
        const finalAmount = Math.max(0, amount - discountAmount);
        return {
            bundle,
            discountAmount,
            finalAmount,
        };
    }
};
exports.BundlesService = BundlesService;
exports.BundlesService = BundlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BundlesService);
//# sourceMappingURL=bundles.service.js.map
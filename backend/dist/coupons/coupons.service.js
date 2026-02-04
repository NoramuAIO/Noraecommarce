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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CouponsService = class CouponsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.coupon.findUnique({
            where: { code: data.code.toUpperCase() },
        });
        if (existing) {
            throw new common_1.BadRequestException('Bu kupon kodu zaten kullanılıyor');
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
    async getById(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
            include: { products: true, orders: true },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Kupon bulunamadı');
        }
        return coupon;
    }
    async update(id, data) {
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
    async delete(id) {
        await this.getById(id);
        return this.prisma.coupon.delete({ where: { id } });
    }
    async validate(code) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
            include: { products: true },
        });
        if (!coupon) {
            throw new common_1.BadRequestException('Geçersiz kupon kodu');
        }
        if (!coupon.active) {
            throw new common_1.BadRequestException('Bu kupon devre dışı bırakılmıştır');
        }
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            throw new common_1.BadRequestException('Bu kuponun süresi dolmuştur');
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            throw new common_1.BadRequestException('Bu kupon maksimum kullanım sayısına ulaşmıştır');
        }
        return coupon;
    }
    async calculateDiscount(couponCode, productId, amount) {
        const coupon = await this.validate(couponCode);
        if (productId === null && !coupon.usableInCart) {
            throw new common_1.BadRequestException('Bu kupon sepette kullanılamaz');
        }
        if (productId !== null) {
            const isApplicable = coupon.products.some(p => p.id === productId);
            if (!isApplicable) {
                throw new common_1.BadRequestException('Bu kupon bu ürüne uygulanamaz');
            }
        }
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (amount * coupon.discountValue) / 100;
        }
        else {
            discountAmount = coupon.discountValue;
        }
        const finalAmount = Math.max(0, amount - discountAmount);
        return {
            coupon,
            discountAmount,
            finalAmount,
        };
    }
    async useCoupon(couponId) {
        return this.prisma.coupon.update({
            where: { id: couponId },
            data: { usedCount: { increment: 1 } },
        });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map
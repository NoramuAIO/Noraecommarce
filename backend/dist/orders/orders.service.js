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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const discord_service_1 = require("../discord/discord.service");
const notifications_service_1 = require("../notifications/notifications.service");
let OrdersService = class OrdersService {
    constructor(prisma, mailService, discordService, notificationsService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.discordService = discordService;
        this.notificationsService = notificationsService;
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: { user: { select: { id: true, name: true, email: true } }, product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { user: true, product: true },
        });
    }
    async create(userId, productId, paymentMethod, couponCode) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.BadRequestException('Ürün bulunamadı');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('Kullanıcı bulunamadı');
        const isFree = product.price === 0 || paymentMethod === 'free';
        let finalPrice = product.price;
        let couponId = null;
        if (couponCode && !isFree) {
            const coupon = await this.prisma.coupon.findUnique({ where: { code: couponCode } });
            if (!coupon) {
                throw new common_1.BadRequestException('Kupon bulunamadı');
            }
            if (!coupon.active) {
                throw new common_1.BadRequestException('Kupon deaktif');
            }
            if (coupon.expiresAt && new Date() > coupon.expiresAt) {
                throw new common_1.BadRequestException('Kupon süresi dolmuş');
            }
            if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                throw new common_1.BadRequestException('Kupon kullanım limiti aşıldı');
            }
            if (coupon.discountType === 'percentage') {
                finalPrice = product.price * (1 - coupon.discountValue / 100);
            }
            else {
                finalPrice = Math.max(0, product.price - coupon.discountValue);
            }
            couponId = coupon.id;
        }
        if (!isFree && paymentMethod === 'balance') {
            if (user.balance < finalPrice) {
                throw new common_1.BadRequestException('Yetersiz bakiye');
            }
        }
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const order = await this.prisma.$transaction(async (tx) => {
            if (!isFree && paymentMethod === 'balance') {
                await tx.user.update({
                    where: { id: userId },
                    data: { balance: { decrement: finalPrice } },
                });
            }
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
            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usedCount: { increment: 1 } },
                });
            }
            if (isFree || paymentMethod === 'balance') {
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
        this.mailService.sendOrderConfirmation({ email: user.email, name: user.name }, { orderNumber, amount: finalPrice, product: { name: product.name } });
        const isPaidProduct = product.price > 0;
        this.discordService.handleOrderCompleted(userId, isPaidProduct, productId).catch(err => {
            console.error('Discord rol verme hatası:', err);
        });
        if (isFree) {
            this.notificationsService.notifyFreeOrder({
                id: order.id,
                productName: product.name,
                userName: user.name,
                userEmail: user.email,
            }).catch(err => console.error('Webhook bildirim hatası:', err));
        }
        else {
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
    async updateStatus(id, status) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: { product: true },
        });
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        discord_service_1.DiscordService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map
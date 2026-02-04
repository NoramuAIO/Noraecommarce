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
exports.IyzicoProvider = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const settings_service_1 = require("../../settings/settings.service");
let IyzicoProvider = class IyzicoProvider {
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    async isEnabled() {
        const enabled = await this.settingsService.get('iyzicoEnabled');
        return enabled === 'true';
    }
    async createPayment(data) {
        const apiKey = await this.settingsService.get('iyzicoApiKey');
        const secretKey = await this.settingsService.get('iyzicoSecretKey');
        if (!apiKey || !secretKey) {
            throw new common_1.BadRequestException('iyzico ayarları yapılandırılmamış');
        }
        const Iyzipay = require('iyzipay');
        const iyzipay = new Iyzipay({
            apiKey,
            secretKey,
            uri: 'https://api.iyzipay.com',
        });
        const conversationId = `IYZICO_${data.userId}_${Date.now()}`;
        const basketId = `B_${Date.now()}`;
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId,
            price: data.amount.toString(),
            paidPrice: data.amount.toString(),
            currency: Iyzipay.CURRENCY.TRY,
            basketId,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${backendUrl}/api/payment/iyzico/callback`,
            buyer: {
                id: `U_${data.userId}`,
                name: data.userName.split(' ')[0] || 'Ad',
                surname: data.userName.split(' ')[1] || 'Soyad',
                gsmNumber: data.userPhone || '+905000000000',
                email: data.email,
                identityNumber: '11111111111',
                registrationAddress: 'Türkiye',
                ip: data.userIp,
                city: 'Istanbul',
                country: 'Turkey',
            },
            shippingAddress: {
                contactName: data.userName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Türkiye',
            },
            billingAddress: {
                contactName: data.userName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Türkiye',
            },
            basketItems: [
                {
                    id: 'BALANCE',
                    name: 'Bakiye Yükleme',
                    category1: 'Bakiye',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: data.amount.toString(),
                },
            ],
        };
        await this.prisma.payment.create({
            data: {
                merchantOid: conversationId,
                userId: data.userId,
                amount: data.amount,
                provider: 'iyzico',
                status: 'pending',
                packageId: data.packageId,
            },
        });
        return new Promise((resolve, reject) => {
            iyzipay.checkoutFormInitialize.create(request, (err, result) => {
                if (err) {
                    reject(new common_1.BadRequestException(`iyzico hatası: ${err.message}`));
                }
                else if (result.status === 'success') {
                    resolve({
                        paymentPageUrl: result.paymentPageUrl,
                        token: result.token,
                        checkoutFormContent: result.checkoutFormContent,
                        conversationId,
                    });
                }
                else {
                    reject(new common_1.BadRequestException(`iyzico hatası: ${result.errorMessage}`));
                }
            });
        });
    }
    async handleCallback(token) {
        const apiKey = await this.settingsService.get('iyzicoApiKey');
        const secretKey = await this.settingsService.get('iyzicoSecretKey');
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const Iyzipay = require('iyzipay');
        const iyzipay = new Iyzipay({
            apiKey,
            secretKey,
            uri: 'https://api.iyzipay.com',
        });
        return new Promise((resolve, reject) => {
            iyzipay.checkoutForm.retrieve({ token }, async (err, result) => {
                if (err) {
                    reject(new common_1.BadRequestException(`iyzico hatası: ${err.message}`));
                    return;
                }
                const payment = await this.prisma.payment.findUnique({
                    where: { merchantOid: result.conversationId },
                });
                if (!payment) {
                    reject(new common_1.BadRequestException('Ödeme bulunamadı'));
                    return;
                }
                if (result.paymentStatus === 'SUCCESS') {
                    await this.prisma.$transaction([
                        this.prisma.payment.update({
                            where: { id: payment.id },
                            data: { status: 'completed' },
                        }),
                        this.prisma.user.update({
                            where: { id: payment.userId },
                            data: { balance: { increment: payment.amount } },
                        }),
                    ]);
                    resolve({ success: true, redirectUrl: `${baseUrl}/balance?status=success` });
                }
                else {
                    await this.prisma.payment.update({
                        where: { id: payment.id },
                        data: { status: 'failed' },
                    });
                    resolve({ success: false, redirectUrl: `${baseUrl}/balance?status=fail` });
                }
            });
        });
    }
};
exports.IyzicoProvider = IyzicoProvider;
exports.IyzicoProvider = IyzicoProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService])
], IyzicoProvider);
//# sourceMappingURL=iyzico.provider.js.map
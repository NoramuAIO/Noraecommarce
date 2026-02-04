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
exports.PaparaProvider = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const settings_service_1 = require("../../settings/settings.service");
let PaparaProvider = class PaparaProvider {
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    async isEnabled() {
        const enabled = await this.settingsService.get('paparaEnabled');
        return enabled === 'true';
    }
    async createPayment(data) {
        const apiKey = await this.settingsService.get('paparaApiKey');
        if (!apiKey) {
            throw new common_1.BadRequestException('Papara ayarları yapılandırılmamış');
        }
        const referenceId = `PAPARA_${data.userId}_${Date.now()}`;
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        await this.prisma.payment.create({
            data: {
                merchantOid: referenceId,
                userId: data.userId,
                amount: data.amount,
                provider: 'papara',
                status: 'pending',
                packageId: data.packageId,
            },
        });
        const response = await fetch('https://merchant-api.papara.com/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': apiKey,
            },
            body: JSON.stringify({
                amount: data.amount,
                referenceId,
                orderDescription: 'Bakiye Yükleme',
                notificationUrl: `${backendUrl}/api/payment/papara/callback`,
                failNotificationUrl: `${backendUrl}/api/payment/papara/callback`,
                redirectUrl: `${baseUrl}/balance?status=success`,
            }),
        });
        const result = await response.json();
        if (result.succeeded) {
            return {
                paymentUrl: result.data.paymentUrl,
                paymentId: result.data.id,
                referenceId,
            };
        }
        else {
            throw new common_1.BadRequestException(`Papara hatası: ${result.error?.message || 'Bilinmeyen hata'}`);
        }
    }
    async handleCallback(body) {
        const { referenceId, status } = body;
        const payment = await this.prisma.payment.findUnique({
            where: { merchantOid: referenceId },
        });
        if (!payment) {
            throw new common_1.BadRequestException('Ödeme bulunamadı');
        }
        if (status === 1 || status === 'completed') {
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
        }
        else {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed' },
            });
        }
        return { success: true };
    }
};
exports.PaparaProvider = PaparaProvider;
exports.PaparaProvider = PaparaProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService])
], PaparaProvider);
//# sourceMappingURL=papara.provider.js.map
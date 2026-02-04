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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const paytr_provider_1 = require("./providers/paytr.provider");
const iyzico_provider_1 = require("./providers/iyzico.provider");
const papara_provider_1 = require("./providers/papara.provider");
let PaymentService = class PaymentService {
    constructor(prisma, paytrProvider, iyzicoProvider, paparaProvider) {
        this.prisma = prisma;
        this.paytrProvider = paytrProvider;
        this.iyzicoProvider = iyzicoProvider;
        this.paparaProvider = paparaProvider;
    }
    async getActiveProviders() {
        const providers = [];
        if (await this.paytrProvider.isEnabled()) {
            providers.push({ id: 'paytr', name: 'Kredi/Banka Kartı', icon: 'credit-card' });
        }
        if (await this.iyzicoProvider.isEnabled()) {
            providers.push({ id: 'iyzico', name: 'iyzico', icon: 'credit-card' });
        }
        if (await this.paparaProvider.isEnabled()) {
            providers.push({ id: 'papara', name: 'Papara', icon: 'wallet' });
        }
        return providers;
    }
    async createPayment(provider, data) {
        switch (provider) {
            case 'paytr':
                if (!(await this.paytrProvider.isEnabled())) {
                    throw new common_1.BadRequestException('PayTR şu anda aktif değil');
                }
                return this.paytrProvider.createPayment(data);
            case 'iyzico':
                if (!(await this.iyzicoProvider.isEnabled())) {
                    throw new common_1.BadRequestException('iyzico şu anda aktif değil');
                }
                return this.iyzicoProvider.createPayment(data);
            case 'papara':
                if (!(await this.paparaProvider.isEnabled())) {
                    throw new common_1.BadRequestException('Papara şu anda aktif değil');
                }
                return this.paparaProvider.createPayment({
                    userId: data.userId,
                    amount: data.amount,
                    email: data.email,
                    packageId: data.packageId,
                });
            default:
                throw new common_1.BadRequestException('Geçersiz ödeme yöntemi');
        }
    }
    async handlePaytrCallback(body) {
        return this.paytrProvider.handleCallback(body);
    }
    async handleIyzicoCallback(token) {
        return this.iyzicoProvider.handleCallback(token);
    }
    async handlePaparaCallback(body) {
        return this.paparaProvider.handleCallback(body);
    }
    async getPaymentStatus(merchantOid, userId) {
        const payment = await this.prisma.payment.findFirst({
            where: { merchantOid, userId },
        });
        if (!payment) {
            throw new common_1.BadRequestException('Ödeme bulunamadı');
        }
        return payment;
    }
    async getUserPayments(userId) {
        return this.prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        paytr_provider_1.PaytrProvider,
        iyzico_provider_1.IyzicoProvider,
        papara_provider_1.PaparaProvider])
], PaymentService);
//# sourceMappingURL=payment.service.js.map
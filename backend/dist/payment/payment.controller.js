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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async getProviders() {
        return this.paymentService.getActiveProviders();
    }
    async createPayment(body, req) {
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
        return this.paymentService.createPayment(body.provider, {
            userId: req.user.id,
            amount: body.amount,
            email: req.user.email,
            userName: req.user.name || 'Kullanıcı',
            userPhone: body.phone,
            userAddress: body.address,
            userIp: Array.isArray(userIp) ? userIp[0] : userIp.split(',')[0],
            packageId: body.packageId,
        });
    }
    async paytrCallback(body, res) {
        try {
            const result = await this.paymentService.handlePaytrCallback(body);
            res.send(result);
        }
        catch (error) {
            res.status(400).send('FAIL');
        }
    }
    async iyzicoCallback(body, res) {
        try {
            const result = await this.paymentService.handleIyzicoCallback(body.token);
            res.redirect(result.redirectUrl);
        }
        catch (error) {
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/balance?status=fail`);
        }
    }
    async paparaCallback(body) {
        return this.paymentService.handlePaparaCallback(body);
    }
    async getPaymentStatus(merchantOid, req) {
        return this.paymentService.getPaymentStatus(merchantOid, req.user.id);
    }
    async getPaymentHistory(req) {
        return this.paymentService.getUserPayments(req.user.id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)('providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('paytr/callback'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paytrCallback", null);
__decorate([
    (0, common_1.Post)('iyzico/callback'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "iyzicoCallback", null);
__decorate([
    (0, common_1.Post)('papara/callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paparaCallback", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('merchantOid')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentHistory", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map
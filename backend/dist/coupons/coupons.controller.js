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
exports.CouponsController = void 0;
const common_1 = require("@nestjs/common");
const coupons_service_1 = require("./coupons.service");
const admin_guard_1 = require("../auth/admin.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CouponsController = class CouponsController {
    constructor(couponsService) {
        this.couponsService = couponsService;
    }
    async create(data) {
        return this.couponsService.create({
            ...data,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        });
    }
    async getAll() {
        return this.couponsService.getAll();
    }
    async getById(id) {
        return this.couponsService.getById(id);
    }
    async update(id, data) {
        return this.couponsService.update(id, {
            ...data,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        });
    }
    async delete(id) {
        return this.couponsService.delete(id);
    }
    async validate(code) {
        return this.couponsService.validate(code);
    }
    async calculateDiscount(data) {
        return this.couponsService.calculateDiscount(data.couponCode, data.productId ?? null, data.amount);
    }
};
exports.CouponsController = CouponsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('validate/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)('calculate-discount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "calculateDiscount", null);
exports.CouponsController = CouponsController = __decorate([
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupons_service_1.CouponsService])
], CouponsController);
//# sourceMappingURL=coupons.controller.js.map
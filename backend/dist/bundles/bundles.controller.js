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
exports.BundlesController = void 0;
const common_1 = require("@nestjs/common");
const bundles_service_1 = require("./bundles.service");
const admin_guard_1 = require("../auth/admin.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BundlesController = class BundlesController {
    constructor(bundlesService) {
        this.bundlesService = bundlesService;
    }
    async calculateDiscount(data) {
        return this.bundlesService.calculateDiscount(data.bundleId, data.productId, data.amount);
    }
    async create(data) {
        return this.bundlesService.create(data);
    }
    async getAll() {
        return this.bundlesService.getAll();
    }
    async getById(id) {
        return this.bundlesService.getById(parseInt(id));
    }
    async update(id, data) {
        return this.bundlesService.update(parseInt(id), data);
    }
    async delete(id) {
        return this.bundlesService.delete(parseInt(id));
    }
};
exports.BundlesController = BundlesController;
__decorate([
    (0, common_1.Post)('calculate-discount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "calculateDiscount", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BundlesController.prototype, "delete", null);
exports.BundlesController = BundlesController = __decorate([
    (0, common_1.Controller)('bundles'),
    __metadata("design:paramtypes", [bundles_service_1.BundlesService])
], BundlesController);
//# sourceMappingURL=bundles.controller.js.map
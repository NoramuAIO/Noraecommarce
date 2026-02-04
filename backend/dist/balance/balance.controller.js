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
exports.BalanceController = void 0;
const common_1 = require("@nestjs/common");
const balance_service_1 = require("./balance.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let BalanceController = class BalanceController {
    constructor(balanceService) {
        this.balanceService = balanceService;
    }
    async findAllPackages() {
        return this.balanceService.findAllPackages();
    }
    async createPackage(data) {
        return this.balanceService.createPackage(data);
    }
    async updatePackage(id, data) {
        return this.balanceService.updatePackage(+id, data);
    }
    async deletePackage(id) {
        return this.balanceService.deletePackage(+id);
    }
};
exports.BalanceController = BalanceController;
__decorate([
    (0, common_1.Get)('packages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "findAllPackages", null);
__decorate([
    (0, common_1.Post)('packages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "createPackage", null);
__decorate([
    (0, common_1.Put)('packages/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "updatePackage", null);
__decorate([
    (0, common_1.Delete)('packages/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BalanceController.prototype, "deletePackage", null);
exports.BalanceController = BalanceController = __decorate([
    (0, common_1.Controller)('balance'),
    __metadata("design:paramtypes", [balance_service_1.BalanceService])
], BalanceController);
//# sourceMappingURL=balance.controller.js.map
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
exports.ReferralsController = void 0;
const common_1 = require("@nestjs/common");
const referrals_service_1 = require("./referrals.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
let ReferralsController = class ReferralsController {
    constructor(referralsService) {
        this.referralsService = referralsService;
    }
    async addReferral(req, data) {
        return this.referralsService.addReferral(req.user.id, data.referredId, {
            name: req.user.name,
            email: req.user.email,
            image: req.user.avatar,
            website: data.website,
            discord: data.discord,
        });
    }
    async getReferralsForUser(userId) {
        return this.referralsService.getReferralsForUser(parseInt(userId));
    }
    async getReferralsGivenByUser(userId, req) {
        if (parseInt(userId) !== req.user.id && req.user.role !== 'admin') {
            return [];
        }
        return this.referralsService.getReferralsGivenByUser(parseInt(userId));
    }
    async getAllReferrals() {
        return this.referralsService.getAllReferrals();
    }
    async getReferral(id) {
        return this.referralsService.getAllReferrals().then(refs => refs.find(r => r.id === parseInt(id)));
    }
    async updateReferral(id, data) {
        return this.referralsService.updateReferral(parseInt(id), data);
    }
    async deleteReferral(id) {
        return this.referralsService.deleteReferral(parseInt(id));
    }
    async approveReferral(id) {
        return this.referralsService.approveReferral(parseInt(id));
    }
    async rejectReferral(id) {
        return this.referralsService.rejectReferral(parseInt(id));
    }
    async generateReferralLink(req) {
        const link = this.referralsService.generateReferralLink(req.user.id);
        return { link };
    }
    async applyReferralLink(req, data) {
        return this.referralsService.validateAndApplyReferralLink(data.link, req.user.id);
    }
};
exports.ReferralsController = ReferralsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "addReferral", null);
__decorate([
    (0, common_1.Get)('for-user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getReferralsForUser", null);
__decorate([
    (0, common_1.Get)('given-by-user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getReferralsGivenByUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getAllReferrals", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getReferral", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "updateReferral", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "deleteReferral", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "approveReferral", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "rejectReferral", null);
__decorate([
    (0, common_1.Post)('generate-link'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "generateReferralLink", null);
__decorate([
    (0, common_1.Post)('apply-link'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "applyReferralLink", null);
exports.ReferralsController = ReferralsController = __decorate([
    (0, common_1.Controller)('referrals'),
    __metadata("design:paramtypes", [referrals_service_1.ReferralsService])
], ReferralsController);
//# sourceMappingURL=referrals.controller.js.map
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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const favorites_service_1 = require("../favorites/favorites.service");
let ProductsController = class ProductsController {
    constructor(productsService, favoritesService) {
        this.productsService = productsService;
        this.favoritesService = favoritesService;
    }
    async findAll(categoryId) {
        return this.productsService.findAll(categoryId ? +categoryId : undefined);
    }
    async findPaid(categoryId) {
        return this.productsService.findPaid(categoryId ? +categoryId : undefined);
    }
    async findFree() {
        return this.productsService.findFree();
    }
    async findBestSellers(limit) {
        return this.productsService.findBestSellers(limit ? +limit : 8);
    }
    async findOne(id) {
        if (isNaN(+id)) {
            return this.productsService.findBySlug(id);
        }
        return this.productsService.findById(+id);
    }
    async create(data) {
        return this.productsService.create(data);
    }
    async update(id, data) {
        return this.productsService.update(+id, data, this.favoritesService.notifyFavoriteUsers.bind(this.favoritesService));
    }
    async delete(id) {
        return this.productsService.delete(+id);
    }
    async getChangelogs(id) {
        return this.productsService.getChangelogs(+id);
    }
    async createChangelog(id, data) {
        return this.productsService.createChangelog(+id, data, this.favoritesService.notifyFavoriteUsers.bind(this.favoritesService));
    }
    async deleteChangelog(changelogId) {
        return this.productsService.deleteChangelog(+changelogId);
    }
    async getReviews(id) {
        return this.productsService.getReviews(+id);
    }
    async getReviewsAdmin(id) {
        return this.productsService.getReviews(+id, true);
    }
    async createReview(id, data) {
        return this.productsService.createReview(+id, data);
    }
    async updateReview(reviewId, data) {
        return this.productsService.updateReview(+reviewId, data);
    }
    async deleteReview(reviewId) {
        return this.productsService.deleteReview(+reviewId);
    }
    async getAllReviewsAdmin() {
        return this.productsService.getAllReviewsAdmin();
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('paid'),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findPaid", null);
__decorate([
    (0, common_1.Get)('free'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findFree", null);
__decorate([
    (0, common_1.Get)('best-sellers'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findBestSellers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/changelogs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getChangelogs", null);
__decorate([
    (0, common_1.Post)(':id/changelogs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createChangelog", null);
__decorate([
    (0, common_1.Delete)('changelogs/:changelogId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('changelogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteChangelog", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Get)(':id/reviews/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getReviewsAdmin", null);
__decorate([
    (0, common_1.Post)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createReview", null);
__decorate([
    (0, common_1.Put)('reviews/:reviewId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)('reviews/:reviewId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('admin/reviews/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllReviewsAdmin", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        favorites_service_1.FavoritesService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map
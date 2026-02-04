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
exports.LiveChatController = void 0;
const common_1 = require("@nestjs/common");
const livechat_service_1 = require("./livechat.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LiveChatController = class LiveChatController {
    constructor(liveChatService) {
        this.liveChatService = liveChatService;
    }
    async startChat(body) {
        return this.liveChatService.createChat(body);
    }
    async getBySession(sessionId) {
        return this.liveChatService.findBySessionId(sessionId);
    }
    async sendMessageBySession(sessionId, body) {
        return this.liveChatService.sendMessageBySession(sessionId, body.content, false);
    }
    async getActiveChats() {
        return this.liveChatService.findAllActive();
    }
    async getAllChats() {
        return this.liveChatService.findAll();
    }
    async getWaitingCount() {
        const count = await this.liveChatService.getWaitingCount();
        return { count };
    }
    async getChatById(id) {
        return this.liveChatService.findById(+id);
    }
    async sendAdminMessage(id, body, req) {
        return this.liveChatService.sendMessage(+id, body.content, true, req.user.name || 'Admin');
    }
    async closeChat(id) {
        return this.liveChatService.closeChat(+id);
    }
    async deleteChat(id) {
        return this.liveChatService.delete(+id);
    }
};
exports.LiveChatController = LiveChatController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "startChat", null);
__decorate([
    (0, common_1.Get)('session/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "getBySession", null);
__decorate([
    (0, common_1.Post)('session/:sessionId/message'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "sendMessageBySession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "getActiveChats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "getAllChats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/waiting-count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "getWaitingCount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "getChatById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('admin/:id/message'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "sendAdminMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('admin/:id/close'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "closeChat", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveChatController.prototype, "deleteChat", null);
exports.LiveChatController = LiveChatController = __decorate([
    (0, common_1.Controller)('livechat'),
    __metadata("design:paramtypes", [livechat_service_1.LiveChatService])
], LiveChatController);
//# sourceMappingURL=livechat.controller.js.map
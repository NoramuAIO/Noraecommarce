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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const mail_service_1 = require("../mail/mail.service");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsController = class SettingsController {
    constructor(settingsService, mailService, prisma) {
        this.settingsService = settingsService;
        this.mailService = mailService;
        this.prisma = prisma;
    }
    async getAll() {
        return this.settingsService.getAll();
    }
    async getPublic() {
        const settings = await this.settingsService.getAll();
        return {
            maintenanceMode: settings['maintenanceMode'] || 'false',
            maintenanceEstimate: settings['maintenanceEstimate'] || '',
            siteName: settings['siteName'] || 'Noramu',
            siteDescription: settings['siteDescription'] || 'Premium Minecraft Pluginleri',
            discordLink: settings['discordLink'] || 'https://discord.gg/noramu',
            discordName: settings['discordName'] || 'Discord Sunucumuz',
            contactEmail: settings['contactEmail'] || 'destek@noramu.com',
            workingHoursWeekday: settings['workingHoursWeekday'] || '09:00 - 22:00',
            workingHoursSaturday: settings['workingHoursSaturday'] || '10:00 - 18:00',
            workingHoursSunday: settings['workingHoursSunday'] || '12:00 - 18:00',
            primaryColor: settings['primaryColor'] || '#8B5CF6',
            accentColor: settings['accentColor'] || '#EC4899',
            siteTheme: settings['siteTheme'] || 'modern',
            heroTitle1: settings['heroTitle1'] || 'Minecraft için',
            heroTitle2: settings['heroTitle2'] || 'Premium Pluginler',
            heroSubtitle: settings['heroSubtitle'] || 'Sunucunuzu bir üst seviyeye taşıyın. Performans odaklı, güvenilir ve sürekli güncellenen pluginler ile fark yaratın.',
            heroBadgeText: settings['heroBadgeText'] || 'Yeni pluginler eklendi',
            heroBadgeEnabled: settings['heroBadgeEnabled'] || 'true',
            googleLoginEnabled: settings['googleLoginEnabled'] || 'false',
            discordLoginEnabled: settings['discordLoginEnabled'] || 'false',
            liveChatEnabled: settings['liveChatEnabled'] || 'false',
            liveChatWelcome: settings['liveChatWelcome'] || 'Merhaba! Size nasıl yardımcı olabiliriz?',
            liveChatOffline: settings['liveChatOffline'] || 'Şu anda çevrimdışıyız. Lütfen destek talebi oluşturun.',
            liveChatPages: settings['liveChatPages'] || '["home","products","blog","faq","contact"]',
            cartSystemEnabled: settings['cartSystemEnabled'] || 'false',
            siteLogo: settings['siteLogo'] || '',
            siteLogoDark: settings['siteLogoDark'] || '',
            siteFavicon: settings['siteFavicon'] || '',
            bestSellersEnabled: settings['bestSellersEnabled'] || 'false',
        };
    }
    async update(settings) {
        await this.settingsService.setMany(settings);
        return this.settingsService.getAll();
    }
    async testEmail(body) {
        await this.mailService.sendTestEmail(body.email);
        return { success: true };
    }
    async getWhitelist() {
        return this.prisma.emailVerificationWhitelist.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async addToWhitelist(body) {
        const existing = await this.prisma.emailVerificationWhitelist.findUnique({
            where: { email: body.email },
        }).catch(() => null);
        if (existing) {
            return { message: 'Bu e-posta zaten whitelist\'te' };
        }
        return this.prisma.emailVerificationWhitelist.create({
            data: { email: body.email },
        });
    }
    async removeFromWhitelist(email) {
        return this.prisma.emailVerificationWhitelist.delete({
            where: { email },
        }).catch(() => ({ message: 'E-posta bulunamadı' }));
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getPublic", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('test-email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "testEmail", null);
__decorate([
    (0, common_1.Get)('email-verification-whitelist'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getWhitelist", null);
__decorate([
    (0, common_1.Post)('email-verification-whitelist'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "addToWhitelist", null);
__decorate([
    (0, common_1.Delete)('email-verification-whitelist/:email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "removeFromWhitelist", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        mail_service_1.MailService,
        prisma_service_1.PrismaService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map
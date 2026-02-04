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
exports.OAuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const settings_service_1 = require("../settings/settings.service");
let OAuthController = class OAuthController {
    constructor(authService, settingsService) {
        this.authService = authService;
        this.settingsService = settingsService;
    }
    async googleAuth(res) {
        const settings = await this.settingsService.getAll();
        if (settings.googleLoginEnabled !== 'true') {
            throw new common_1.UnauthorizedException('Google ile giriş kapalı');
        }
        const clientId = settings.googleClientId;
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        const redirectUri = settings.googleRedirectUri || `${backendUrl}/api/auth/oauth/google/callback`;
        const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=code` +
            `&scope=${encodeURIComponent('email profile')}` +
            `&access_type=offline`;
        res.redirect(url);
    }
    async googleCallback(code, res) {
        try {
            const settings = await this.settingsService.getAll();
            if (settings.googleLoginEnabled !== 'true') {
                throw new common_1.UnauthorizedException('Google ile giriş kapalı');
            }
            const clientId = settings.googleClientId;
            const clientSecret = settings.googleClientSecret;
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
            const redirectUri = settings.googleRedirectUri || `${backendUrl}/api/auth/oauth/google/callback`;
            const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: clientId || '',
                    client_secret: clientSecret || '',
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                }),
            });
            const tokenData = await tokenRes.json();
            if (!tokenData.access_token) {
                throw new common_1.UnauthorizedException('Google token alınamadı');
            }
            const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const userData = await userRes.json();
            const result = await this.authService.findOrCreateOAuthUser({
                email: userData.email,
                name: userData.name,
                avatar: userData.picture,
                provider: 'google',
                providerId: userData.id,
            });
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
        }
        catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }
    }
    async discordAuth(res) {
        const settings = await this.settingsService.getAll();
        if (settings.discordLoginEnabled !== 'true') {
            throw new common_1.UnauthorizedException('Discord ile giriş kapalı');
        }
        const clientId = settings.discordClientId;
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        const redirectUri = settings.discordRedirectUri || `${backendUrl}/api/auth/oauth/discord/callback`;
        const url = `https://discord.com/api/oauth2/authorize?` +
            `client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=code` +
            `&scope=${encodeURIComponent('identify email')}`;
        res.redirect(url);
    }
    async discordCallback(code, res) {
        try {
            const settings = await this.settingsService.getAll();
            if (settings.discordLoginEnabled !== 'true') {
                throw new common_1.UnauthorizedException('Discord ile giriş kapalı');
            }
            const clientId = settings.discordClientId;
            const clientSecret = settings.discordClientSecret;
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
            const redirectUri = settings.discordRedirectUri || `${backendUrl}/api/auth/oauth/discord/callback`;
            const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: clientId || '',
                    client_secret: clientSecret || '',
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                }),
            });
            const tokenData = await tokenRes.json();
            if (!tokenData.access_token) {
                throw new common_1.UnauthorizedException('Discord token alınamadı');
            }
            const userRes = await fetch('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const userData = await userRes.json();
            let avatarUrl;
            if (userData.avatar) {
                const ext = userData.avatar.startsWith('a_') ? 'gif' : 'webp';
                avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${ext}?size=256`;
            }
            const result = await this.authService.findOrCreateOAuthUser({
                email: userData.email,
                name: userData.global_name || userData.username,
                avatar: avatarUrl,
                provider: 'discord',
                providerId: userData.id,
            });
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
        }
        catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }
    }
};
exports.OAuthController = OAuthController;
__decorate([
    (0, common_1.Get)('google'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Get)('discord'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "discordAuth", null);
__decorate([
    (0, common_1.Get)('discord/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "discordCallback", null);
exports.OAuthController = OAuthController = __decorate([
    (0, common_1.Controller)('auth/oauth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        settings_service_1.SettingsService])
], OAuthController);
//# sourceMappingURL=oauth.controller.js.map
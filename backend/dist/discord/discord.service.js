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
exports.DiscordService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DiscordService = class DiscordService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDiscordSettings() {
        const settings = await this.prisma.settings.findMany({
            where: {
                key: {
                    in: ['discordBotToken', 'discordGuildId', 'discordCustomerRoleId', 'discordPremiumRoleId']
                }
            }
        });
        const result = {};
        for (const s of settings) {
            result[s.key] = s.value;
        }
        return result;
    }
    async addRoleToUser(discordId, roleId) {
        try {
            const settings = await this.getDiscordSettings();
            const { discordBotToken, discordGuildId } = settings;
            if (!discordBotToken || !discordGuildId || !roleId) {
                console.log('Discord ayarları eksik');
                return false;
            }
            const response = await fetch(`https://discord.com/api/v10/guilds/${discordGuildId}/members/${discordId}/roles/${roleId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bot ${discordBotToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok || response.status === 204) {
                console.log(`Discord rol verildi: User ${discordId}, Role ${roleId}`);
                return true;
            }
            else {
                const error = await response.text();
                console.error('Discord rol verme hatası:', error);
                return false;
            }
        }
        catch (error) {
            console.error('Discord API hatası:', error);
            return false;
        }
    }
    async giveCustomerRole(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.discordId) {
            console.log('Kullanıcının Discord ID\'si yok');
            return false;
        }
        const settings = await this.getDiscordSettings();
        const roleId = settings.discordCustomerRoleId;
        if (!roleId) {
            console.log('Müşteri rol ID\'si ayarlanmamış');
            return false;
        }
        return this.addRoleToUser(user.discordId, roleId);
    }
    async givePremiumRole(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.discordId) {
            console.log('Kullanıcının Discord ID\'si yok');
            return false;
        }
        const settings = await this.getDiscordSettings();
        const roleId = settings.discordPremiumRoleId;
        if (!roleId) {
            console.log('Premium rol ID\'si ayarlanmamış');
            return false;
        }
        return this.addRoleToUser(user.discordId, roleId);
    }
    async handleOrderCompleted(userId, isPaid, productId) {
        await this.giveCustomerRole(userId);
        if (isPaid) {
            await this.givePremiumRole(userId);
        }
        if (productId) {
            await this.giveProductRole(userId, productId);
        }
    }
    async giveProductRole(userId, productId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.discordId) {
            console.log('Kullanıcının Discord ID\'si yok');
            return false;
        }
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product?.discordRoleId) {
            console.log('Ürüne Discord rolü atanmamış');
            return false;
        }
        return this.addRoleToUser(user.discordId, product.discordRoleId);
    }
};
exports.DiscordService = DiscordService;
exports.DiscordService = DiscordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscordService);
//# sourceMappingURL=discord.service.js.map
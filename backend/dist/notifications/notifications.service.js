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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        const settings = await this.prisma.settings.findMany({
            where: {
                key: {
                    in: [
                        'discordWebhookUrl',
                        'telegramBotToken',
                        'telegramChatId',
                        'notifyDiscordOrder',
                        'notifyDiscordFreeOrder',
                        'notifyDiscordPriceChange',
                        'notifyDiscordProductUpdate',
                        'notifyDiscordNewUser',
                        'notifyDiscordTicket',
                        'notifyTelegramOrder',
                        'notifyTelegramFreeOrder',
                        'notifyTelegramPriceChange',
                        'notifyTelegramProductUpdate',
                        'notifyTelegramNewUser',
                        'notifyTelegramTicket',
                    ]
                }
            }
        });
        const result = {};
        for (const s of settings) {
            result[s.key] = s.value;
        }
        return result;
    }
    async sendDiscordWebhook(data) {
        try {
            const settings = await this.getSettings();
            const webhookUrl = settings.discordWebhookUrl;
            if (!webhookUrl) {
                console.log('Discord webhook URL ayarlanmamış');
                return false;
            }
            const notifyKey = `notifyDiscord${this.capitalizeType(data.type)}`;
            if (settings[notifyKey] === 'false') {
                console.log(`Discord ${data.type} bildirimi kapalı`);
                return false;
            }
            const embed = {
                title: data.title,
                description: data.description,
                color: data.color || this.getColorForType(data.type),
                fields: data.fields || [],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Noramu Bildirim Sistemi'
                }
            };
            if (data.url) {
                embed.url = data.url;
            }
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
            if (response.ok) {
                console.log('Discord webhook gönderildi');
                return true;
            }
            else {
                const error = await response.text();
                console.error('Discord webhook hatası:', error);
                return false;
            }
        }
        catch (error) {
            console.error('Discord webhook hatası:', error);
            return false;
        }
    }
    async sendTelegramMessage(data) {
        try {
            const settings = await this.getSettings();
            const botToken = settings.telegramBotToken;
            const chatId = settings.telegramChatId;
            if (!botToken || !chatId) {
                console.log('Telegram ayarları eksik');
                return false;
            }
            const notifyKey = `notifyTelegram${this.capitalizeType(data.type)}`;
            if (settings[notifyKey] === 'false') {
                console.log(`Telegram ${data.type} bildirimi kapalı`);
                return false;
            }
            let message = `*${this.escapeMarkdown(data.title)}*\n\n`;
            message += `${this.escapeMarkdown(data.description)}\n`;
            if (data.fields && data.fields.length > 0) {
                message += '\n';
                for (const field of data.fields) {
                    message += `*${this.escapeMarkdown(field.name)}:* ${this.escapeMarkdown(field.value)}\n`;
                }
            }
            if (data.url) {
                message += `\n[Detaylar](${data.url})`;
            }
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'MarkdownV2',
                    disable_web_page_preview: true
                })
            });
            if (response.ok) {
                console.log('Telegram mesajı gönderildi');
                return true;
            }
            else {
                const error = await response.json();
                console.error('Telegram hatası:', error);
                return false;
            }
        }
        catch (error) {
            console.error('Telegram hatası:', error);
            return false;
        }
    }
    escapeMarkdown(text) {
        return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
    }
    capitalizeType(type) {
        const map = {
            'order': 'Order',
            'free_order': 'FreeOrder',
            'price_change': 'PriceChange',
            'product_update': 'ProductUpdate',
            'new_user': 'NewUser',
            'ticket': 'Ticket'
        };
        return map[type] || type;
    }
    getColorForType(type) {
        const colors = {
            'order': 0x22c55e,
            'free_order': 0x3b82f6,
            'price_change': 0xf59e0b,
            'product_update': 0x8b5cf6,
            'new_user': 0x06b6d4,
            'ticket': 0xef4444
        };
        return colors[type] || 0x8b5cf6;
    }
    async notifyOrder(order) {
        const data = {
            type: 'order',
            title: '💰 Yeni Satış!',
            description: `${order.productName} ürünü satıldı.`,
            fields: [
                { name: 'Sipariş No', value: `#${order.id}`, inline: true },
                { name: 'Tutar', value: `₺${order.amount}`, inline: true },
                { name: 'Müşteri', value: order.userName, inline: true },
                { name: 'E-posta', value: order.userEmail, inline: false }
            ]
        };
        await Promise.all([
            this.sendDiscordWebhook(data),
            this.sendTelegramMessage(data)
        ]);
    }
    async notifyFreeOrder(order) {
        const data = {
            type: 'free_order',
            title: '🎁 Ücretsiz Ürün Alındı',
            description: `${order.productName} ücretsiz ürünü alındı.`,
            fields: [
                { name: 'Sipariş No', value: `#${order.id}`, inline: true },
                { name: 'Müşteri', value: order.userName, inline: true },
                { name: 'E-posta', value: order.userEmail, inline: false }
            ]
        };
        await Promise.all([
            this.sendDiscordWebhook(data),
            this.sendTelegramMessage(data)
        ]);
    }
    async notifyPriceChange(product) {
        const priceDirection = product.newPrice > product.oldPrice ? '📈' : '📉';
        const data = {
            type: 'price_change',
            title: `${priceDirection} Fiyat Değişikliği`,
            description: `${product.name} ürününün fiyatı değişti.`,
            fields: [
                { name: 'Eski Fiyat', value: `₺${product.oldPrice}`, inline: true },
                { name: 'Yeni Fiyat', value: `₺${product.newPrice}`, inline: true },
                { name: 'Değiştiren', value: product.changedBy, inline: true }
            ]
        };
        await Promise.all([
            this.sendDiscordWebhook(data),
            this.sendTelegramMessage(data)
        ]);
    }
    async notifyProductUpdate(product) {
        const data = {
            type: 'product_update',
            title: '🔄 Ürün Güncellendi',
            description: `${product.name} ürünü güncellendi.`,
            fields: [
                { name: 'Güncelleme', value: product.updateType, inline: true },
                { name: 'Detay', value: product.details, inline: false },
                { name: 'Güncelleyen', value: product.updatedBy, inline: true }
            ]
        };
        await Promise.all([
            this.sendDiscordWebhook(data),
            this.sendTelegramMessage(data)
        ]);
    }
    async notifyNewUser(user) {
        const data = {
            type: 'new_user',
            title: '👤 Yeni Kullanıcı',
            description: `Yeni bir kullanıcı kayıt oldu.`,
            fields: [
                { name: 'İsim', value: user.name, inline: true },
                { name: 'E-posta', value: user.email, inline: true },
                { name: 'Kayıt Yöntemi', value: user.provider || 'E-posta', inline: true }
            ]
        };
        await Promise.all([
            this.sendDiscordWebhook(data),
            this.sendTelegramMessage(data)
        ]);
    }
    async notifyTicket(ticket) {
        const data = {
            type: 'ticket',
            title: '🎫 Yeni Destek Talebi',
            description: `Yeni bir destek talebi oluşturuldu.`,
            fields: [
                { name: 'Talep No', value: `#${ticket.id}`, inline: true },
                { name: 'Konu', value: ticket.subject, inline: false },
                { name: 'Kullanıcı', value: ticket.userName, inline: true },
                { name: 'E-posta', value: ticket.userEmail, inline: true }
            ]
        };
        await Promise.all([
            this.sendDiscordWebhook(data),
            this.sendTelegramMessage(data)
        ]);
    }
    async sendTestNotification(platform) {
        const data = {
            type: 'order',
            title: '🧪 Test Bildirimi',
            description: 'Bu bir test bildirimidir. Bildirim sistemi çalışıyor!',
            fields: [
                { name: 'Platform', value: platform === 'discord' ? 'Discord' : 'Telegram', inline: true },
                { name: 'Tarih', value: new Date().toLocaleString('tr-TR'), inline: true }
            ]
        };
        if (platform === 'discord') {
            return this.sendDiscordWebhook(data);
        }
        else {
            return this.sendTelegramMessage(data);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
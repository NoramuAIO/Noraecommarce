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
exports.ReferralsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const settings_service_1 = require("../settings/settings.service");
const crypto = require("crypto");
let ReferralsService = class ReferralsService {
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    async addReferral(referrerId, referredId, referrerData) {
        const existing = await this.prisma.referral.findFirst({
            where: {
                referrerId,
                referredId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Bu referral zaten mevcut');
        }
        if (referrerId === referredId) {
            throw new common_1.BadRequestException('Kendinizi referans edemezsiniz');
        }
        const referral = await this.prisma.referral.create({
            data: {
                referrerId,
                referredId,
                referrerName: referrerData.name,
                referrerEmail: referrerData.email,
                referrerImage: referrerData.image,
                referrerWebsite: referrerData.website,
                referrerDiscord: referrerData.discord,
                status: 'approved',
            },
            include: {
                referrer: true,
                referred: true,
            },
        });
        await this.giveReferralCredits(referral.id);
        return referral;
    }
    async giveReferralCredits(referralId) {
        const referral = await this.prisma.referral.findUnique({
            where: { id: referralId },
            include: { referrer: true, referred: true },
        });
        if (!referral || referral.creditGiven) {
            return;
        }
        try {
            const referredCreditSetting = await this.settingsService.get('referralCreditReferred');
            const referrerCreditSetting = await this.settingsService.get('referralCreditReferrer');
            const referredCredit = parseFloat(referredCreditSetting || '50');
            const referrerCredit = parseFloat(referrerCreditSetting || '50');
            await this.prisma.$transaction([
                this.prisma.user.update({
                    where: { id: referral.referredId },
                    data: { balance: { increment: referredCredit } },
                }),
                this.prisma.user.update({
                    where: { id: referral.referrerId },
                    data: { balance: { increment: referrerCredit } },
                }),
                this.prisma.referral.update({
                    where: { id: referralId },
                    data: { creditGiven: true },
                }),
                this.prisma.balanceTransaction.create({
                    data: {
                        userId: referral.referredId,
                        amount: referredCredit,
                        type: 'add',
                        previousBalance: referral.referred.balance,
                        newBalance: referral.referred.balance + referredCredit,
                        isRevenue: true,
                        note: `Referral credit - referred by ${referral.referrerName}`,
                    },
                }),
                this.prisma.balanceTransaction.create({
                    data: {
                        userId: referral.referrerId,
                        amount: referrerCredit,
                        type: 'add',
                        previousBalance: referral.referrer.balance,
                        newBalance: referral.referrer.balance + referrerCredit,
                        isRevenue: true,
                        note: `Referral credit - referred ${referral.referred.name}`,
                    },
                }),
            ]);
        }
        catch (error) {
            console.error('Kredi verme hatası:', error);
        }
    }
    async getReferralsForUser(userId) {
        return this.prisma.referral.findMany({
            where: {
                referredId: userId,
                active: true,
                status: 'approved',
            },
            include: {
                referrer: true,
            },
            orderBy: { order: 'asc' },
        });
    }
    async getReferralsGivenByUser(userId) {
        return this.prisma.referral.findMany({
            where: {
                referrerId: userId,
            },
            include: {
                referred: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllReferrals() {
        return this.prisma.referral.findMany({
            include: {
                referrer: true,
                referred: true,
            },
            orderBy: { order: 'asc' },
        });
    }
    async updateReferral(id, data) {
        const referral = await this.prisma.referral.findUnique({
            where: { id },
        });
        if (!referral) {
            throw new common_1.NotFoundException('Referral bulunamadı');
        }
        return this.prisma.referral.update({
            where: { id },
            data: {
                referrerName: data.referrerName ?? referral.referrerName,
                referrerEmail: data.referrerEmail ?? referral.referrerEmail,
                referrerImage: data.referrerImage ?? referral.referrerImage,
                referrerWebsite: data.referrerWebsite ?? referral.referrerWebsite,
                referrerDiscord: data.referrerDiscord ?? referral.referrerDiscord,
                status: data.status ?? referral.status,
                order: data.order ?? referral.order,
                active: data.active ?? referral.active,
            },
            include: {
                referrer: true,
                referred: true,
            },
        });
    }
    async deleteReferral(id) {
        const referral = await this.prisma.referral.findUnique({
            where: { id },
        });
        if (!referral) {
            throw new common_1.NotFoundException('Referral bulunamadı');
        }
        return this.prisma.referral.delete({
            where: { id },
        });
    }
    async approveReferral(id) {
        const referral = await this.updateReferral(id, { status: 'approved' });
        if (!referral.creditGiven) {
            await this.giveReferralCredits(id);
        }
        return referral;
    }
    async rejectReferral(id) {
        return this.updateReferral(id, { status: 'rejected' });
    }
    generateReferralLink(userId) {
        const token = crypto.randomBytes(16).toString('hex');
        return `${token}:${userId}`;
    }
    async validateAndApplyReferralLink(referralLink, newUserId) {
        if (!referralLink || !referralLink.includes(':')) {
            throw new common_1.BadRequestException('Geçersiz referral linki');
        }
        const [token, userIdStr] = referralLink.split(':');
        const referrerId = parseInt(userIdStr);
        if (isNaN(referrerId)) {
            throw new common_1.BadRequestException('Geçersiz referral linki');
        }
        const referrer = await this.prisma.user.findUnique({
            where: { id: referrerId },
        });
        if (!referrer) {
            throw new common_1.BadRequestException('Referral linki geçersiz');
        }
        if (referrerId === newUserId) {
            throw new common_1.BadRequestException('Kendinizi referans edemezsiniz');
        }
        const existing = await this.prisma.referral.findFirst({
            where: {
                referrerId,
                referredId: newUserId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Bu referral zaten mevcut');
        }
        const referral = await this.prisma.referral.create({
            data: {
                referrerId,
                referredId: newUserId,
                referrerName: referrer.name,
                referrerEmail: referrer.email,
                referrerImage: referrer.avatar,
                status: 'approved',
            },
            include: {
                referrer: true,
                referred: true,
            },
        });
        await this.giveReferralCredits(referral.id);
        return referral;
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService])
], ReferralsService);
//# sourceMappingURL=referrals.service.js.map
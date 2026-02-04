import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SettingsService } from '../settings/settings.service'
import * as crypto from 'crypto'

@Injectable()
export class ReferralsService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  async addReferral(referrerId: number, referredId: number, referrerData: {
    name: string
    email: string
    image?: string
    website?: string
    discord?: string
  }) {
    // Aynı referral zaten varsa hata ver
    const existing = await this.prisma.referral.findFirst({
      where: {
        referrerId,
        referredId,
      },
    })

    if (existing) {
      throw new BadRequestException('Bu referral zaten mevcut')
    }

    // Kendi kendini referans edemez
    if (referrerId === referredId) {
      throw new BadRequestException('Kendinizi referans edemezsiniz')
    }

    // Referral oluştur (otomatik approved)
    const referral = await this.prisma.referral.create({
      data: {
        referrerId,
        referredId,
        referrerName: referrerData.name,
        referrerEmail: referrerData.email,
        referrerImage: referrerData.image,
        referrerWebsite: referrerData.website,
        referrerDiscord: referrerData.discord,
        status: 'approved', // Otomatik onaylandı
      },
      include: {
        referrer: true,
        referred: true,
      },
    })

    // Kredi ver
    await this.giveReferralCredits(referral.id)

    return referral
  }

  async giveReferralCredits(referralId: number) {
    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
      include: { referrer: true, referred: true },
    })

    if (!referral || referral.creditGiven) {
      return // Zaten kredi verilmişse veya referral bulunamadıysa çık
    }

    try {
      // Settings'den kredi miktarlarını al
      const referredCreditSetting = await this.settingsService.get('referralCreditReferred')
      const referrerCreditSetting = await this.settingsService.get('referralCreditReferrer')

      const referredCredit = parseFloat(referredCreditSetting || '50')
      const referrerCredit = parseFloat(referrerCreditSetting || '50')

      // Transaction ile her iki kullanıcıya kredi ver
      await this.prisma.$transaction([
        // Referans alan kişiye kredi ver
        this.prisma.user.update({
          where: { id: referral.referredId },
          data: { balance: { increment: referredCredit } },
        }),
        // Referans veren kişiye kredi ver
        this.prisma.user.update({
          where: { id: referral.referrerId },
          data: { balance: { increment: referrerCredit } },
        }),
        // Referral'ı creditGiven olarak işaretle
        this.prisma.referral.update({
          where: { id: referralId },
          data: { creditGiven: true },
        }),
        // BalanceTransaction kayıtları oluştur (referans alan)
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
        // BalanceTransaction kayıtları oluştur (referans veren)
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
      ])
    } catch (error) {
      console.error('Kredi verme hatası:', error)
    }
  }

  async getReferralsForUser(userId: number) {
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
    })
  }

  async getReferralsGivenByUser(userId: number) {
    return this.prisma.referral.findMany({
      where: {
        referrerId: userId,
      },
      include: {
        referred: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAllReferrals() {
    return this.prisma.referral.findMany({
      include: {
        referrer: true,
        referred: true,
      },
      orderBy: { order: 'asc' },
    })
  }

  async updateReferral(id: number, data: {
    referrerName?: string
    referrerEmail?: string
    referrerImage?: string
    referrerWebsite?: string
    referrerDiscord?: string
    status?: string
    order?: number
    active?: boolean
  }) {
    const referral = await this.prisma.referral.findUnique({
      where: { id },
    })

    if (!referral) {
      throw new NotFoundException('Referral bulunamadı')
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
    })
  }

  async deleteReferral(id: number) {
    const referral = await this.prisma.referral.findUnique({
      where: { id },
    })

    if (!referral) {
      throw new NotFoundException('Referral bulunamadı')
    }

    return this.prisma.referral.delete({
      where: { id },
    })
  }

  async approveReferral(id: number) {
    const referral = await this.updateReferral(id, { status: 'approved' })
    
    // Kredi ver (eğer verilmemişse)
    if (!referral.creditGiven) {
      await this.giveReferralCredits(id)
    }

    return referral
  }

  async rejectReferral(id: number) {
    return this.updateReferral(id, { status: 'rejected' })
  }

  // Referral linki oluştur
  generateReferralLink(userId: number): string {
    const token = crypto.randomBytes(16).toString('hex')
    return `${token}:${userId}`
  }

  // Referral linkini doğrula ve referral oluştur
  async validateAndApplyReferralLink(referralLink: string, newUserId: number) {
    if (!referralLink || !referralLink.includes(':')) {
      throw new BadRequestException('Geçersiz referral linki')
    }

    const [token, userIdStr] = referralLink.split(':')
    const referrerId = parseInt(userIdStr)

    if (isNaN(referrerId)) {
      throw new BadRequestException('Geçersiz referral linki')
    }

    // Referrer'ı kontrol et
    const referrer = await this.prisma.user.findUnique({
      where: { id: referrerId },
    })

    if (!referrer) {
      throw new BadRequestException('Referral linki geçersiz')
    }

    // Kendi kendini referans edemez
    if (referrerId === newUserId) {
      throw new BadRequestException('Kendinizi referans edemezsiniz')
    }

    // Aynı referral zaten varsa hata ver
    const existing = await this.prisma.referral.findFirst({
      where: {
        referrerId,
        referredId: newUserId,
      },
    })

    if (existing) {
      throw new BadRequestException('Bu referral zaten mevcut')
    }

    // Referral oluştur (otomatik approved)
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
    })

    // Kredi ver
    await this.giveReferralCredits(referral.id)

    return referral
  }
}

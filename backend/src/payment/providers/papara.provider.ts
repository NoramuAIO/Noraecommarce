import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingsService } from '../../settings/settings.service';

export interface PaymentData {
  userId: number;
  amount: number;
  email: string;
  packageId?: number;
}

@Injectable()
export class PaparaProvider {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  async isEnabled(): Promise<boolean> {
    const enabled = await this.settingsService.get('paparaEnabled');
    return enabled === 'true';
  }

  async createPayment(data: PaymentData) {
    const apiKey = await this.settingsService.get('paparaApiKey');

    if (!apiKey) {
      throw new BadRequestException('Papara ayarları yapılandırılmamış');
    }

    const referenceId = `PAPARA_${data.userId}_${Date.now()}`;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    await this.prisma.payment.create({
      data: {
        merchantOid: referenceId,
        userId: data.userId,
        amount: data.amount,
        provider: 'papara',
        status: 'pending',
        packageId: data.packageId,
      },
    });

    const response = await fetch('https://merchant-api.papara.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': apiKey,
      },
      body: JSON.stringify({
        amount: data.amount,
        referenceId,
        orderDescription: 'Bakiye Yükleme',
        notificationUrl: `${backendUrl}/api/payment/papara/callback`,
        failNotificationUrl: `${backendUrl}/api/payment/papara/callback`,
        redirectUrl: `${baseUrl}/balance?status=success`,
      }),
    });

    const result = await response.json();

    if (result.succeeded) {
      return {
        paymentUrl: result.data.paymentUrl,
        paymentId: result.data.id,
        referenceId,
      };
    } else {
      throw new BadRequestException(`Papara hatası: ${result.error?.message || 'Bilinmeyen hata'}`);
    }
  }

  async handleCallback(body: any) {
    const { referenceId, status } = body;

    const payment = await this.prisma.payment.findUnique({
      where: { merchantOid: referenceId },
    });

    if (!payment) {
      throw new BadRequestException('Ödeme bulunamadı');
    }

    if (status === 1 || status === 'completed') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'completed' },
        }),
        this.prisma.user.update({
          where: { id: payment.userId },
          data: { balance: { increment: payment.amount } },
        }),
      ]);
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
    }

    return { success: true };
  }
}

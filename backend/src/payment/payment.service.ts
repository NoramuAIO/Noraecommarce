import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaytrProvider } from './providers/paytr.provider';
import { IyzicoProvider } from './providers/iyzico.provider';
import { PaparaProvider } from './providers/papara.provider';

export interface PaymentData {
  userId: number;
  amount: number;
  email: string;
  userName: string;
  userPhone?: string;
  userAddress?: string;
  userIp: string;
  packageId?: number;
}

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private paytrProvider: PaytrProvider,
    private iyzicoProvider: IyzicoProvider,
    private paparaProvider: PaparaProvider,
  ) {}

  // Aktif ödeme yöntemlerini getir
  async getActiveProviders() {
    const providers = [];

    if (await this.paytrProvider.isEnabled()) {
      providers.push({ id: 'paytr', name: 'Kredi/Banka Kartı', icon: 'credit-card' });
    }
    if (await this.iyzicoProvider.isEnabled()) {
      providers.push({ id: 'iyzico', name: 'iyzico', icon: 'credit-card' });
    }
    if (await this.paparaProvider.isEnabled()) {
      providers.push({ id: 'papara', name: 'Papara', icon: 'wallet' });
    }

    return providers;
  }

  // Ödeme başlat
  async createPayment(provider: string, data: PaymentData) {
    switch (provider) {
      case 'paytr':
        if (!(await this.paytrProvider.isEnabled())) {
          throw new BadRequestException('PayTR şu anda aktif değil');
        }
        return this.paytrProvider.createPayment(data);

      case 'iyzico':
        if (!(await this.iyzicoProvider.isEnabled())) {
          throw new BadRequestException('iyzico şu anda aktif değil');
        }
        return this.iyzicoProvider.createPayment(data);

      case 'papara':
        if (!(await this.paparaProvider.isEnabled())) {
          throw new BadRequestException('Papara şu anda aktif değil');
        }
        return this.paparaProvider.createPayment({
          userId: data.userId,
          amount: data.amount,
          email: data.email,
          packageId: data.packageId,
        });

      default:
        throw new BadRequestException('Geçersiz ödeme yöntemi');
    }
  }

  // PayTR Callback
  async handlePaytrCallback(body: any) {
    return this.paytrProvider.handleCallback(body);
  }

  // iyzico Callback
  async handleIyzicoCallback(token: string) {
    return this.iyzicoProvider.handleCallback(token);
  }

  // Papara Callback
  async handlePaparaCallback(body: any) {
    return this.paparaProvider.handleCallback(body);
  }

  // Ödeme durumu sorgula
  async getPaymentStatus(merchantOid: string, userId: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { merchantOid, userId },
    });

    if (!payment) {
      throw new BadRequestException('Ödeme bulunamadı');
    }

    return payment;
  }

  // Kullanıcının ödeme geçmişi
  async getUserPayments(userId: number) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}

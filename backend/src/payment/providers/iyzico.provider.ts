import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingsService } from '../../settings/settings.service';

export interface PaymentData {
  userId: number;
  amount: number;
  email: string;
  userName: string;
  userPhone?: string;
  userIp: string;
  packageId?: number;
}

@Injectable()
export class IyzicoProvider {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  async isEnabled(): Promise<boolean> {
    const enabled = await this.settingsService.get('iyzicoEnabled');
    return enabled === 'true';
  }

  async createPayment(data: PaymentData) {
    const apiKey = await this.settingsService.get('iyzicoApiKey');
    const secretKey = await this.settingsService.get('iyzicoSecretKey');

    if (!apiKey || !secretKey) {
      throw new BadRequestException('iyzico ayarları yapılandırılmamış');
    }

    const Iyzipay = require('iyzipay');
    const iyzipay = new Iyzipay({
      apiKey,
      secretKey,
      uri: 'https://api.iyzipay.com',
    });

    const conversationId = `IYZICO_${data.userId}_${Date.now()}`;
    const basketId = `B_${Date.now()}`;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: data.amount.toString(),
      paidPrice: data.amount.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      basketId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${backendUrl}/api/payment/iyzico/callback`,
      buyer: {
        id: `U_${data.userId}`,
        name: data.userName.split(' ')[0] || 'Ad',
        surname: data.userName.split(' ')[1] || 'Soyad',
        gsmNumber: data.userPhone || '+905000000000',
        email: data.email,
        identityNumber: '11111111111',
        registrationAddress: 'Türkiye',
        ip: data.userIp,
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: data.userName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      billingAddress: {
        contactName: data.userName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      basketItems: [
        {
          id: 'BALANCE',
          name: 'Bakiye Yükleme',
          category1: 'Bakiye',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: data.amount.toString(),
        },
      ],
    };

    await this.prisma.payment.create({
      data: {
        merchantOid: conversationId,
        userId: data.userId,
        amount: data.amount,
        provider: 'iyzico',
        status: 'pending',
        packageId: data.packageId,
      },
    });

    return new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) {
          reject(new BadRequestException(`iyzico hatası: ${err.message}`));
        } else if (result.status === 'success') {
          resolve({
            paymentPageUrl: result.paymentPageUrl,
            token: result.token,
            checkoutFormContent: result.checkoutFormContent,
            conversationId,
          });
        } else {
          reject(new BadRequestException(`iyzico hatası: ${result.errorMessage}`));
        }
      });
    });
  }

  async handleCallback(token: string) {
    const apiKey = await this.settingsService.get('iyzicoApiKey');
    const secretKey = await this.settingsService.get('iyzicoSecretKey');
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const Iyzipay = require('iyzipay');
    const iyzipay = new Iyzipay({
      apiKey,
      secretKey,
      uri: 'https://api.iyzipay.com',
    });

    return new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ token }, async (err: any, result: any) => {
        if (err) {
          reject(new BadRequestException(`iyzico hatası: ${err.message}`));
          return;
        }

        const payment = await this.prisma.payment.findUnique({
          where: { merchantOid: result.conversationId },
        });

        if (!payment) {
          reject(new BadRequestException('Ödeme bulunamadı'));
          return;
        }

        if (result.paymentStatus === 'SUCCESS') {
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
          resolve({ success: true, redirectUrl: `${baseUrl}/balance?status=success` });
        } else {
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'failed' },
          });
          resolve({ success: false, redirectUrl: `${baseUrl}/balance?status=fail` });
        }
      });
    });
  }
}

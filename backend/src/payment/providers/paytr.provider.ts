import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingsService } from '../../settings/settings.service';
import * as crypto from 'crypto';

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
export class PaytrProvider {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  async isEnabled(): Promise<boolean> {
    const enabled = await this.settingsService.get('paytrEnabled');
    return enabled === 'true';
  }

  async createPayment(data: PaymentData) {
    const merchantId = await this.settingsService.get('paytrMerchantId');
    const merchantKey = await this.settingsService.get('paytrMerchantKey');
    const merchantSalt = await this.settingsService.get('paytrMerchantSalt');

    if (!merchantId || !merchantKey || !merchantSalt) {
      throw new BadRequestException('PayTR ayarları yapılandırılmamış');
    }

    const merchantOid = `PAYTR_${data.userId}_${Date.now()}`;
    const paymentAmount = Math.round(data.amount * 100);
    const currency = 'TL';
    const testMode = '1';
    const noInstallment = '1';
    const maxInstallment = '0';

    const userBasket = Buffer.from(JSON.stringify([
      ['Bakiye Yükleme', data.amount.toFixed(2), 1]
    ])).toString('base64');

    const hashStr = `${merchantId}${data.userIp}${merchantOid}${data.email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
    const paytrToken = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr + merchantSalt)
      .digest('base64');

    await this.prisma.payment.create({
      data: {
        merchantOid,
        userId: data.userId,
        amount: data.amount,
        provider: 'paytr',
        status: 'pending',
        packageId: data.packageId,
      },
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const postData = {
      merchant_id: merchantId,
      user_ip: data.userIp,
      merchant_oid: merchantOid,
      email: data.email,
      payment_amount: paymentAmount.toString(),
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: '1',
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: data.userName,
      user_address: data.userAddress || 'Türkiye',
      user_phone: data.userPhone || '05000000000',
      merchant_ok_url: `${baseUrl}/balance?status=success`,
      merchant_fail_url: `${baseUrl}/balance?status=fail`,
      timeout_limit: '30',
      currency,
      test_mode: testMode,
    };

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(postData).toString(),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return { 
        token: result.token, 
        merchantOid,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      };
    } else {
      throw new BadRequestException(`PayTR hatası: ${result.reason}`);
    }
  }

  async handleCallback(body: any) {
    const merchantKey = await this.settingsService.get('paytrMerchantKey');
    const merchantSalt = await this.settingsService.get('paytrMerchantSalt');

    const { merchant_oid, status, total_amount, hash } = body;

    const hashStr = `${merchant_oid}${merchantSalt}${status}${total_amount}`;
    const expectedHash = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');

    if (hash !== expectedHash) {
      throw new BadRequestException('Geçersiz hash');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { merchantOid: merchant_oid },
    });

    if (!payment) {
      throw new BadRequestException('Ödeme bulunamadı');
    }

    if (status === 'success') {
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

    return 'OK';
  }
}

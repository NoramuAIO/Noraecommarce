import { Controller, Post, Body, Get, Query, Req, UseGuards, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Aktif ödeme yöntemlerini getir
  @Get('providers')
  async getProviders() {
    return this.paymentService.getActiveProviders();
  }

  // Ödeme başlat (tüm yöntemler için tek endpoint)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPayment(@Body() body: any, @Req() req: any) {
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
    
    return this.paymentService.createPayment(body.provider, {
      userId: req.user.id,
      amount: body.amount,
      email: req.user.email,
      userName: req.user.name || 'Kullanıcı',
      userPhone: body.phone,
      userAddress: body.address,
      userIp: Array.isArray(userIp) ? userIp[0] : userIp.split(',')[0],
      packageId: body.packageId,
    });
  }

  // PayTR callback
  @Post('paytr/callback')
  async paytrCallback(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.paymentService.handlePaytrCallback(body);
      res.send(result);
    } catch (error) {
      res.status(400).send('FAIL');
    }
  }

  // iyzico callback
  @Post('iyzico/callback')
  async iyzicoCallback(@Body() body: any, @Res() res: Response) {
    try {
      const result: any = await this.paymentService.handleIyzicoCallback(body.token);
      res.redirect(result.redirectUrl);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/balance?status=fail`);
    }
  }

  // Papara callback
  @Post('papara/callback')
  async paparaCallback(@Body() body: any) {
    return this.paymentService.handlePaparaCallback(body);
  }

  // Ödeme durumu sorgula
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(@Query('merchantOid') merchantOid: string, @Req() req: any) {
    return this.paymentService.getPaymentStatus(merchantOid, req.user.id);
  }

  // Kullanıcının ödeme geçmişi
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getPaymentHistory(@Req() req: any) {
    return this.paymentService.getUserPayments(req.user.id);
  }
}

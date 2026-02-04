import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsModule } from '../settings/settings.module';
import { PaytrProvider } from './providers/paytr.provider';
import { IyzicoProvider } from './providers/iyzico.provider';
import { PaparaProvider } from './providers/papara.provider';

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaytrProvider,
    IyzicoProvider,
    PaparaProvider,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}

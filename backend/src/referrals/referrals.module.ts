import { Module } from '@nestjs/common'
import { ReferralsService } from './referrals.service'
import { ReferralsController } from './referrals.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { SettingsModule } from '../settings/settings.module'

@Module({
  imports: [PrismaModule, SettingsModule],
  providers: [ReferralsService],
  controllers: [ReferralsController],
  exports: [ReferralsService],
})
export class ReferralsModule {}

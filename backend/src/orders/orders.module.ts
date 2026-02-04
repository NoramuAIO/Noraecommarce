import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DiscordModule } from '../discord/discord.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [DiscordModule, NotificationsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}

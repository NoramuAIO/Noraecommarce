import { Module } from '@nestjs/common';
import { LiveChatService } from './livechat.service';
import { LiveChatController } from './livechat.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LiveChatController],
  providers: [LiveChatService],
  exports: [LiveChatService],
})
export class LiveChatModule {}

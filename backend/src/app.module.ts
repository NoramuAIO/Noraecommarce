import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ProductsModule } from './products/products.module'
import { CategoriesModule } from './categories/categories.module'
import { OrdersModule } from './orders/orders.module'
import { BlogModule } from './blog/blog.module'
import { FaqModule } from './faq/faq.module'
import { TicketsModule } from './tickets/tickets.module'
import { BalanceModule } from './balance/balance.module'
import { SettingsModule } from './settings/settings.module'
import { StatsModule } from './stats/stats.module'
import { FeaturesModule } from './features/features.module'
import { TestimonialsModule } from './testimonials/testimonials.module'
import { UploadModule } from './upload/upload.module'
import { MailModule } from './mail/mail.module'
import { ReferencesModule } from './references/references.module'
import { FavoritesModule } from './favorites/favorites.module'
import { LiveChatModule } from './livechat/livechat.module'
import { DiscordModule } from './discord/discord.module'
import { PaymentModule } from './payment/payment.module'
import { NotificationsModule } from './notifications/notifications.module'
import { CouponsModule } from './coupons/coupons.module'
import { BundlesModule } from './bundles/bundles.module'
import { PopupsModule } from './popups/popups.module'
import { ReferralsModule } from './referrals/referrals.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting: 100 requests per 15 minutes per IP
    ThrottlerModule.forRoot([
      {
        ttl: 900000, // 15 minutes in milliseconds
        limit: 100,
      },
    ]),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    BlogModule,
    FaqModule,
    TicketsModule,
    BalanceModule,
    SettingsModule,
    StatsModule,
    FeaturesModule,
    TestimonialsModule,
    UploadModule,
    ReferencesModule,
    FavoritesModule,
    LiveChatModule,
    DiscordModule,
    PaymentModule,
    NotificationsModule,
    CouponsModule,
    BundlesModule,
    PopupsModule,
    ReferralsModule,
  ],
})
export class AppModule {}

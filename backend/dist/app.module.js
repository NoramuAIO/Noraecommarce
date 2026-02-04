"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const orders_module_1 = require("./orders/orders.module");
const blog_module_1 = require("./blog/blog.module");
const faq_module_1 = require("./faq/faq.module");
const tickets_module_1 = require("./tickets/tickets.module");
const balance_module_1 = require("./balance/balance.module");
const settings_module_1 = require("./settings/settings.module");
const stats_module_1 = require("./stats/stats.module");
const features_module_1 = require("./features/features.module");
const testimonials_module_1 = require("./testimonials/testimonials.module");
const upload_module_1 = require("./upload/upload.module");
const mail_module_1 = require("./mail/mail.module");
const references_module_1 = require("./references/references.module");
const favorites_module_1 = require("./favorites/favorites.module");
const livechat_module_1 = require("./livechat/livechat.module");
const discord_module_1 = require("./discord/discord.module");
const payment_module_1 = require("./payment/payment.module");
const notifications_module_1 = require("./notifications/notifications.module");
const coupons_module_1 = require("./coupons/coupons.module");
const bundles_module_1 = require("./bundles/bundles.module");
const popups_module_1 = require("./popups/popups.module");
const referrals_module_1 = require("./referrals/referrals.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 900000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            orders_module_1.OrdersModule,
            blog_module_1.BlogModule,
            faq_module_1.FaqModule,
            tickets_module_1.TicketsModule,
            balance_module_1.BalanceModule,
            settings_module_1.SettingsModule,
            stats_module_1.StatsModule,
            features_module_1.FeaturesModule,
            testimonials_module_1.TestimonialsModule,
            upload_module_1.UploadModule,
            references_module_1.ReferencesModule,
            favorites_module_1.FavoritesModule,
            livechat_module_1.LiveChatModule,
            discord_module_1.DiscordModule,
            payment_module_1.PaymentModule,
            notifications_module_1.NotificationsModule,
            coupons_module_1.CouponsModule,
            bundles_module_1.BundlesModule,
            popups_module_1.PopupsModule,
            referrals_module_1.ReferralsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
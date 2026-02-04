import { SettingsService } from './settings.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsController {
    private settingsService;
    private mailService;
    private prisma;
    constructor(settingsService: SettingsService, mailService: MailService, prisma: PrismaService);
    getAll(): Promise<{}>;
    getPublic(): Promise<{
        maintenanceMode: string;
        maintenanceEstimate: string;
        siteName: string;
        siteDescription: string;
        discordLink: string;
        discordName: string;
        contactEmail: string;
        workingHoursWeekday: string;
        workingHoursSaturday: string;
        workingHoursSunday: string;
        primaryColor: string;
        accentColor: string;
        siteTheme: string;
        heroTitle1: string;
        heroTitle2: string;
        heroSubtitle: string;
        heroBadgeText: string;
        heroBadgeEnabled: string;
        googleLoginEnabled: string;
        discordLoginEnabled: string;
        liveChatEnabled: string;
        liveChatWelcome: string;
        liveChatOffline: string;
        liveChatPages: string;
        cartSystemEnabled: string;
        siteLogo: string;
        siteLogoDark: string;
        siteFavicon: string;
        bestSellersEnabled: string;
    }>;
    update(settings: Record<string, string>): Promise<{}>;
    testEmail(body: {
        email: string;
    }): Promise<{
        success: boolean;
    }>;
    getWhitelist(): Promise<{
        id: number;
        email: string;
        createdAt: Date;
    }[]>;
    addToWhitelist(body: {
        email: string;
    }): Promise<{
        id: number;
        email: string;
        createdAt: Date;
    } | {
        message: string;
    }>;
    removeFromWhitelist(email: string): Promise<{
        id: number;
        email: string;
        createdAt: Date;
    } | {
        message: string;
    }>;
}

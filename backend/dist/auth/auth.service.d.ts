import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    private notificationsService;
    private settingsService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService, notificationsService: NotificationsService, settingsService: SettingsService, prisma: PrismaService);
    register(email: string, password: string, name: string): Promise<{
        user: any;
        token: string;
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        user: any;
        token: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    private generateToken;
    private sanitizeUser;
    findOrCreateOAuthUser(data: {
        email: string;
        name: string;
        avatar?: string;
        provider: string;
        providerId: string;
    }): Promise<{
        user: any;
        token: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}

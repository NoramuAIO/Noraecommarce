"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
const settings_service_1 = require("../settings/settings.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailService, notificationsService, settingsService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.notificationsService = notificationsService;
        this.settingsService = settingsService;
        this.prisma = prisma;
    }
    async register(email, password, name) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('Bu e-posta adresi zaten kullanılıyor');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const isWhitelisted = await this.prisma.emailVerificationWhitelist.findUnique({
            where: { email },
        }).catch(() => null);
        const emailVerificationEnabled = await this.settingsService.get('emailVerificationEnabled');
        const shouldVerifyEmail = emailVerificationEnabled !== 'false' && !isWhitelisted;
        let verificationToken = null;
        let verificationExpiry = null;
        if (shouldVerifyEmail) {
            verificationToken = crypto.randomBytes(32).toString('hex');
            verificationExpiry = new Date(Date.now() + 86400000);
        }
        const user = await this.usersService.create({
            email,
            password: hashedPassword,
            name,
            emailVerificationToken: verificationToken,
            emailVerificationExpiry: verificationExpiry,
            emailVerified: !shouldVerifyEmail,
        });
        if (shouldVerifyEmail) {
            await this.mailService.sendEmailVerification({ email: user.email, name: user.name }, verificationToken);
        }
        this.notificationsService.notifyNewUser({
            id: user.id,
            name: user.name,
            email: user.email,
            provider: 'E-posta',
        }).catch(err => console.error('Webhook bildirim hatası:', err));
        const token = this.generateToken(user);
        const message = shouldVerifyEmail
            ? 'Kayıt başarılı. Lütfen e-postanızı doğrulayın.'
            : 'Kayıt başarılı. Giriş yapabilirsiniz.';
        return { user: this.sanitizeUser(user), token, message };
    }
    async login(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Geçersiz e-posta veya şifre');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Geçersiz e-posta veya şifre');
        }
        if (user.status === 'banned') {
            throw new common_1.UnauthorizedException('Hesabınız yasaklanmıştır. Destek ile iletişime geçin.');
        }
        const isWhitelisted = await this.prisma.emailVerificationWhitelist.findUnique({
            where: { email },
        }).catch(() => null);
        const emailVerificationEnabled = await this.settingsService.get('emailVerificationEnabled');
        const shouldVerifyEmail = emailVerificationEnabled !== 'false' && !isWhitelisted;
        if (shouldVerifyEmail && !user.emailVerified) {
            throw new common_1.UnauthorizedException('Lütfen e-postanızı doğrulayın. Doğrulama e-postasını yeniden göndermek için /resend-verification kullanın.');
        }
        const token = this.generateToken(user);
        return { user: this.sanitizeUser(user), token };
    }
    async verifyEmail(token) {
        const user = await this.usersService.findByEmailVerificationToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Geçersiz doğrulama bağlantısı.');
        }
        if (user.emailVerificationExpiry && new Date() > user.emailVerificationExpiry) {
            throw new common_1.BadRequestException('Doğrulama bağlantısının süresi dolmuş. Lütfen yeni bir istek oluşturun.');
        }
        await this.usersService.update(user.id, {
            emailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpiry: null,
        });
        return { message: 'E-postanız başarıyla doğrulandı. Giriş yapabilirsiniz.' };
    }
    async resendVerificationEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'Eğer bu e-posta kayıtlıysa, doğrulama e-postası gönderildi.' };
        }
        if (user.emailVerified) {
            throw new common_1.BadRequestException('Bu e-posta adresi zaten doğrulanmış.');
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpiry = new Date(Date.now() + 86400000);
        await this.usersService.update(user.id, {
            emailVerificationToken: verificationToken,
            emailVerificationExpiry: verificationExpiry,
        });
        await this.mailService.sendEmailVerification({ email: user.email, name: user.name }, verificationToken);
        return { message: 'Doğrulama e-postası gönderildi.' };
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
    sanitizeUser(user) {
        const { password, ...result } = user;
        return result;
    }
    async findOrCreateOAuthUser(data) {
        let user = await this.usersService.findByEmail(data.email);
        if (user) {
            if (user.status === 'banned') {
                throw new common_1.UnauthorizedException('Hesabınız yasaklanmıştır. Destek ile iletişime geçin.');
            }
            const updateData = {};
            if (data.avatar && data.avatar !== user.avatar) {
                updateData.avatar = data.avatar;
            }
            if (data.provider === 'discord' && data.providerId) {
                updateData.discordId = data.providerId;
            }
            if (Object.keys(updateData).length > 0) {
                user = await this.usersService.update(user.id, updateData);
            }
        }
        else {
            const createData = {
                email: data.email,
                password: '',
                name: data.name,
                avatar: data.avatar,
            };
            if (data.provider === 'discord' && data.providerId) {
                createData.discordId = data.providerId;
            }
            user = await this.usersService.create(createData);
            this.mailService.sendWelcome({ email: user.email, name: user.name });
            this.notificationsService.notifyNewUser({
                id: user.id,
                name: user.name,
                email: user.email,
                provider: data.provider === 'discord' ? 'Discord' : data.provider === 'google' ? 'Google' : data.provider,
            }).catch(err => console.error('Webhook bildirim hatası:', err));
        }
        const token = this.generateToken(user);
        return { user: this.sanitizeUser(user), token };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        await this.usersService.update(user.id, {
            resetToken,
            resetTokenExpiry,
        });
        await this.mailService.sendPasswordReset({ email: user.email, name: user.name }, resetToken);
        return { message: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByResetToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Geçersiz veya süresi dolmuş sıfırlama bağlantısı.');
        }
        if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
            throw new common_1.BadRequestException('Sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir istek oluşturun.');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });
        return { message: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        notifications_service_1.NotificationsService,
        settings_service_1.SettingsService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
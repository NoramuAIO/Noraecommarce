import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService,
    private prisma: PrismaService,
  ) {}

  async register(email: string, password: string, name: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanılıyor');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Whitelist'te mi kontrol et
    const isWhitelisted = await this.prisma.emailVerificationWhitelist.findUnique({
      where: { email },
    }).catch(() => null);

    // E-posta doğrulama ayarını kontrol et
    const emailVerificationEnabled = await this.settingsService.get('emailVerificationEnabled');
    const shouldVerifyEmail = emailVerificationEnabled !== 'false' && !isWhitelisted;

    let verificationToken = null;
    let verificationExpiry = null;

    if (shouldVerifyEmail) {
      // E-posta doğrulama token'ı oluştur
      verificationToken = crypto.randomBytes(32).toString('hex');
      verificationExpiry = new Date(Date.now() + 86400000); // 24 saat geçerli
    }

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
      emailVerified: !shouldVerifyEmail, // Doğrulama kapalıysa otomatik doğrulanmış olarak işaretle
    });

    // E-posta doğrulama e-postası gönder (sadece açıksa ve whitelist'te değilse)
    if (shouldVerifyEmail) {
      await this.mailService.sendEmailVerification(
        { email: user.email, name: user.name },
        verificationToken!
      );
    }

    // Webhook bildirimi gönder (Discord/Telegram)
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

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    // Yasaklı kullanıcı kontrolü
    if (user.status === 'banned') {
      throw new UnauthorizedException('Hesabınız yasaklanmıştır. Destek ile iletişime geçin.');
    }

    // Whitelist'te mi kontrol et
    const isWhitelisted = await this.prisma.emailVerificationWhitelist.findUnique({
      where: { email },
    }).catch(() => null);

    // E-posta doğrulama kontrolü (sadece açıksa ve whitelist'te değilse)
    const emailVerificationEnabled = await this.settingsService.get('emailVerificationEnabled');
    const shouldVerifyEmail = emailVerificationEnabled !== 'false' && !isWhitelisted;

    if (shouldVerifyEmail && !user.emailVerified) {
      throw new UnauthorizedException('Lütfen e-postanızı doğrulayın. Doğrulama e-postasını yeniden göndermek için /resend-verification kullanın.');
    }

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  // E-posta doğrulama
  async verifyEmail(token: string) {
    const user = await this.usersService.findByEmailVerificationToken(token);
    
    if (!user) {
      throw new BadRequestException('Geçersiz doğrulama bağlantısı.');
    }

    if (user.emailVerificationExpiry && new Date() > user.emailVerificationExpiry) {
      throw new BadRequestException('Doğrulama bağlantısının süresi dolmuş. Lütfen yeni bir istek oluşturun.');
    }

    // E-postayı doğrula
    await this.usersService.update(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    });

    return { message: 'E-postanız başarıyla doğrulandı. Giriş yapabilirsiniz.' };
  }

  // Doğrulama e-postasını yeniden gönder
  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Güvenlik için kullanıcı bulunamsa bile başarılı mesajı dön
      return { message: 'Eğer bu e-posta kayıtlıysa, doğrulama e-postası gönderildi.' };
    }

    if (user.emailVerified) {
      throw new BadRequestException('Bu e-posta adresi zaten doğrulanmış.');
    }

    // Yeni token oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 86400000); // 24 saat geçerli

    await this.usersService.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    // E-posta doğrulama e-postası gönder
    await this.mailService.sendEmailVerification(
      { email: user.email, name: user.name },
      verificationToken
    );

    return { message: 'Doğrulama e-postası gönderildi.' };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }

  async findOrCreateOAuthUser(data: {
    email: string;
    name: string;
    avatar?: string;
    provider: string;
    providerId: string;
  }) {
    let user = await this.usersService.findByEmail(data.email);

    if (user) {
      // Yasaklı kullanıcı kontrolü
      if (user.status === 'banned') {
        throw new UnauthorizedException('Hesabınız yasaklanmıştır. Destek ile iletişime geçin.');
      }
      // Avatar ve discordId güncelle (her girişte güncel)
      const updateData: any = {};
      if (data.avatar && data.avatar !== user.avatar) {
        updateData.avatar = data.avatar;
      }
      if (data.provider === 'discord' && data.providerId) {
        updateData.discordId = data.providerId;
      }
      if (Object.keys(updateData).length > 0) {
        user = await this.usersService.update(user.id, updateData);
      }
    } else {
      // Yeni kullanıcı oluştur
      const createData: any = {
        email: data.email,
        password: '', // OAuth kullanıcıları için şifre yok
        name: data.name,
        avatar: data.avatar,
      };
      if (data.provider === 'discord' && data.providerId) {
        createData.discordId = data.providerId;
      }
      user = await this.usersService.create(createData);

      // Hoş geldin e-postası gönder
      this.mailService.sendWelcome({ email: user.email, name: user.name });

      // Webhook bildirimi gönder (Discord/Telegram)
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

  // Şifre sıfırlama isteği
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Güvenlik için kullanıcı bulunamasa bile başarılı mesajı dön
      return { message: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.' };
    }

    // Token oluştur
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 saat geçerli

    // Token'ı kaydet
    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    // E-posta gönder
    await this.mailService.sendPasswordReset(
      { email: user.email, name: user.name },
      resetToken
    );

    return { message: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.' };
  }

  // Şifre sıfırlama
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    
    if (!user) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş sıfırlama bağlantısı.');
    }

    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir istek oluşturun.');
    }

    // Yeni şifreyi hashle ve kaydet
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return { message: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.' };
  }
}

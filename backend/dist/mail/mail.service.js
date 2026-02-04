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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendMail(to, subject, html) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('[Mail] SMTP ayarları yapılmamış, e-posta gönderilmedi:', subject);
            return;
        }
        try {
            await this.transporter.sendMail({
                from: `"${process.env.SITE_NAME || 'Noramu'}" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });
            console.log('[Mail] E-posta gönderildi:', to, subject);
        }
        catch (error) {
            console.error('[Mail] E-posta gönderilemedi:', error);
        }
    }
    async sendOrderConfirmation(user, order) {
        const subject = `Sipariş Onayı - #${order.orderNumber}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 24px; margin: 16px 0; }
          .info-box { background: #252525; border-radius: 12px; padding: 20px; margin: 16px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
          .info-row:last-child { border-bottom: none; }
          .label { color: #888; }
          .value { color: #fff; font-weight: 500; }
          .highlight { color: #8b5cf6; }
          .button { display: inline-block; background: linear-gradient(to right, #8b5cf6, #d946ef); color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .footer { text-align: center; margin-top: 32px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Noramu</div>
            <h1 class="title">Sipariş Onayı ✓</h1>
          </div>
          
          <p>Merhaba <strong>${user.name}</strong>,</p>
          <p>Siparişiniz başarıyla tamamlandı! İşte sipariş detaylarınız:</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">Sipariş No</span>
              <span class="value">#${order.orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Ürün</span>
              <span class="value">${order.product.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Tutar</span>
              <span class="value highlight">₺${order.amount}</span>
            </div>
          </div>
          
          <p>Ürününüze profilinizden erişebilirsiniz.</p>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" class="button">Profilime Git</a>
          </center>
          
          <div class="footer">
            <p>Teşekkür ederiz!</p>
            <p>Noramu Ekibi</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await this.sendMail(user.email, subject, html);
    }
    async sendTicketCreated(user, ticket) {
        const subject = `Destek Talebi Oluşturuldu - #${ticket.id}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 24px; margin: 16px 0; }
          .info-box { background: #252525; border-radius: 12px; padding: 20px; margin: 16px 0; }
          .highlight { color: #8b5cf6; }
          .button { display: inline-block; background: linear-gradient(to right, #8b5cf6, #d946ef); color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .footer { text-align: center; margin-top: 32px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Noramu</div>
            <h1 class="title">Destek Talebi Alındı 📩</h1>
          </div>
          
          <p>Merhaba <strong>${user.name}</strong>,</p>
          <p>Destek talebiniz başarıyla oluşturuldu.</p>
          
          <div class="info-box">
            <p><strong>Talep No:</strong> <span class="highlight">#${ticket.id}</span></p>
            <p><strong>Konu:</strong> ${ticket.subject}</p>
          </div>
          
          <p>En kısa sürede size dönüş yapacağız. Talebinizi profilinizden takip edebilirsiniz.</p>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" class="button">Talebimi Görüntüle</a>
          </center>
          
          <div class="footer">
            <p>Noramu Destek Ekibi</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await this.sendMail(user.email, subject, html);
    }
    async sendTicketReply(user, ticket, replyMessage) {
        const subject = `Destek Talebinize Yanıt - #${ticket.id}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 24px; margin: 16px 0; }
          .info-box { background: #252525; border-radius: 12px; padding: 20px; margin: 16px 0; }
          .reply-box { background: #1f1f3a; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 8px; margin: 16px 0; }
          .highlight { color: #8b5cf6; }
          .button { display: inline-block; background: linear-gradient(to right, #8b5cf6, #d946ef); color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .footer { text-align: center; margin-top: 32px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Noramu</div>
            <h1 class="title">Yeni Yanıt 💬</h1>
          </div>
          
          <p>Merhaba <strong>${user.name}</strong>,</p>
          <p>Destek talebinize yanıt verildi.</p>
          
          <div class="info-box">
            <p><strong>Talep No:</strong> <span class="highlight">#${ticket.id}</span></p>
            <p><strong>Konu:</strong> ${ticket.subject}</p>
          </div>
          
          <div class="reply-box">
            <p style="margin: 0;">${replyMessage}</p>
          </div>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" class="button">Yanıtı Görüntüle</a>
          </center>
          
          <div class="footer">
            <p>Noramu Destek Ekibi</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await this.sendMail(user.email, subject, html);
    }
    async sendTestEmail(to) {
        const subject = `Test E-postası - Noramu`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 24px; margin: 16px 0; }
          .success-box { background: #10b981; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 32px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Noramu</div>
            <h1 class="title">Test E-postası ✓</h1>
          </div>
          
          <div class="success-box">
            <p style="margin: 0; font-size: 18px;">🎉 E-posta ayarlarınız doğru çalışıyor!</p>
          </div>
          
          <p>Bu e-posta, SMTP ayarlarınızın doğru yapılandırıldığını doğrulamak için gönderildi.</p>
          <p>Artık sipariş onayları, destek bildirimleri ve hoş geldin e-postaları gönderilebilir.</p>
          
          <div class="footer">
            <p>Noramu Admin Panel</p>
          </div>
        </div>
      </body>
      </html>
    `;
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP ayarları yapılmamış. .env dosyasını kontrol edin.');
        }
        try {
            await this.transporter.sendMail({
                from: `"${process.env.SITE_NAME || 'Noramu'}" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });
        }
        catch (error) {
            throw new Error(`E-posta gönderilemedi: ${error.message}`);
        }
    }
    async sendWelcome(user) {
        const subject = `Noramu'ya Hoş Geldiniz! 🎉`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 24px; margin: 16px 0; }
          .feature-list { background: #252525; border-radius: 12px; padding: 20px; margin: 16px 0; }
          .feature { padding: 8px 0; border-bottom: 1px solid #333; }
          .feature:last-child { border-bottom: none; }
          .button { display: inline-block; background: linear-gradient(to right, #8b5cf6, #d946ef); color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .footer { text-align: center; margin-top: 32px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Noramu</div>
            <h1 class="title">Hoş Geldiniz! 🎉</h1>
          </div>
          
          <p>Merhaba <strong>${user.name}</strong>,</p>
          <p>Noramu ailesine katıldığınız için teşekkür ederiz!</p>
          
          <div class="feature-list">
            <div class="feature">✨ Premium Minecraft pluginleri keşfedin</div>
            <div class="feature">🛡️ Güvenli ödeme sistemi</div>
            <div class="feature">💬 7/24 destek</div>
            <div class="feature">🎁 Ücretsiz kaynaklar</div>
          </div>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" class="button">Ürünleri Keşfet</a>
          </center>
          
          <div class="footer">
            <p>Sorularınız için bize ulaşabilirsiniz.</p>
            <p>Noramu Ekibi</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await this.sendMail(user.email, subject, html);
    }
    async sendPasswordReset(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        const subject = `Şifre Sıfırlama Talebi - Noramu`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 24px; margin: 16px 0; }
          .warning-box { background: #3b2a1a; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 16px 0; }
          .warning-text { color: #fbbf24; margin: 0; }
          .button { display: inline-block; background: linear-gradient(to right, #8b5cf6, #d946ef); color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .link-box { background: #252525; border-radius: 8px; padding: 12px; margin: 16px 0; word-break: break-all; font-size: 12px; color: #888; }
          .footer { text-align: center; margin-top: 32px; color: #666; font-size: 14px; }
          .expire-info { color: #888; font-size: 13px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Noramu</div>
            <h1 class="title">Şifre Sıfırlama 🔐</h1>
          </div>
          
          <p>Merhaba <strong>${user.name}</strong>,</p>
          <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          
          <center>
            <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
          </center>
          
          <p class="expire-info">⏰ Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>
          
          <div class="warning-box">
            <p class="warning-text">⚠️ Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.</p>
          </div>
          
          <p style="color: #888; font-size: 13px;">Buton çalışmıyorsa, aşağıdaki bağlantıyı tarayıcınıza kopyalayın:</p>
          <div class="link-box">${resetUrl}</div>
          
          <div class="footer">
            <p>Noramu Güvenlik Ekibi</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await this.sendMail(user.email, subject, html);
    }
    async sendEmailVerification(user, verificationToken) {
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        const subject = `Hesabınızı Doğrulayın - Noramu`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(to right, #8b5cf6, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 24px; margin: 16px 0; }
          .info-box { background: #252525; border-radius: 12px; padding: 20px; margin: 16px 0; }
          .button { display: inline-block; background: linear-gradient(to right, #8b5cf6, #d946ef); color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .link-box { background: #252525; border-radius: 8px; padding: 12px; margin: 16px 0; word-break: break-all; font-size: 12px; color: #888; }
          .footer { text-align: center; margin-top: 32px; color: #666; font-size: 14px; }
          .expire-info { color: #888; font-size: 13px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Noramu</div>
            <h1 class="title">Hesabınızı Doğrulayın ✓</h1>
          </div>
          
          <p>Merhaba <strong>${user.name}</strong>,</p>
          <p>Noramu'ya hoş geldiniz! Hesabınızı etkinleştirmek için e-postanızı doğrulamanız gerekiyor.</p>
          
          <div class="info-box">
            <p style="margin: 0; color: #888;">Doğrulama bağlantısı 24 saat geçerlidir.</p>
          </div>
          
          <center>
            <a href="${verificationUrl}" class="button">E-postamı Doğrula</a>
          </center>
          
          <p class="expire-info">⏰ Bu bağlantı 24 saat içinde geçerliliğini yitirecektir.</p>
          
          <p style="color: #888; font-size: 13px;">Buton çalışmıyorsa, aşağıdaki bağlantıyı tarayıcınıza kopyalayın:</p>
          <div class="link-box">${verificationUrl}</div>
          
          <p style="margin-top: 24px; color: #888; font-size: 13px;">Doğrulama yapılmadan giriş yapamayacaksınız. Sorularınız için destek ekibimize ulaşabilirsiniz.</p>
          
          <div class="footer">
            <p>Noramu Güvenlik Ekibi</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await this.sendMail(user.email, subject, html);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map
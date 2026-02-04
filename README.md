<div align="center">

# Noracommerce

**Modern, hızlı ve ölçeklenebilir e-ticaret platformu**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Demo](https://demo.noramu.com.tr) · [Dokümantasyon](https://docs.noramu.com.tr) · [Hata Bildir](https://github.com/NoramuAIO/Noracommerce/issues)

</div>

---

## ✨ Özellikler

- ⚡ **Yüksek Performans** - NestJS ve Prisma ile optimize edilmiş
- 🔐 **Güvenli** - JWT, bcrypt, helmet ve rate limiting
- 💳 **Ödeme Entegrasyonu** - Iyzipay desteği
- 📧 **E-posta Sistemi** - SMTP ile otomatik bildirimler
- � **Admin Dashboard** - Detaylı raporlama ve yönetim
- 🎨 **Modern UI** - Responsive ve kullanıcı dostu arayüz
- 🚀 **Kolay Kurulum** - Tek komutla hazır

## 🚀 Hızlı Başlangıç

```bash
# Projeyi klonla
git clone https://github.com/NoramuAIO/Noracommerce.git
cd Noracommerce/backend

# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
copy .env.example .env.local

# Veritabanını kur
npm run db:setup

# Başlat
npm run start:dev
```

Tarayıcınızda `http://localhost:3001` adresini açın.

## ⚙️ Yapılandırma

`.env.local` dosyasını düzenleyin:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key"

# SMTP (Gmail için app password kullanın)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Site
SITE_NAME=Noramu
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

> 💡 Gmail için [App Password](https://myaccount.google.com/apppasswords) oluşturun

## 📦 Komutlar

```bash
npm run start:dev      # Geliştirme modu
npm run build          # Production build
npm run start:prod     # Production modu
npm run db:setup       # Veritabanı kurulumu
```

## 🛠️ Teknoloji Stack

**Backend**
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [JWT](https://jwt.io/) - Secure authentication
- [Iyzipay](https://www.iyzico.com/) - Payment gateway

**Güvenlik**
- Helmet - HTTP security headers
- Bcrypt - Password hashing
- Throttler - Rate limiting
- CORS - Cross-origin protection

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── auth/           # Authentication
│   ├── users/          # User management
│   ├── products/       # Product catalog
│   ├── orders/         # Order processing
│   ├── payments/       # Payment integration
│   └── common/         # Shared utilities
├── prisma/
│   └── schema.prisma   # Database schema
└── uploads/            # File storage
```

## 🤝 Katkıda Bulunun

Katkılarınızı bekliyoruz!

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'feat: Add feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## � İletişim

**NoramuAIO** - [@NoramuAIO](https://github.com/NoramuAIO)

Proje Linki: [github.com/NoramuAIO/Noracommerce](https://github.com/NoramuAIO/Noracommerce)

---

<div align="center">

**[⭐ Star](https://github.com/NoramuAIO/Noracommerce)** · **[🐛 Report Bug](https://github.com/NoramuAIO/Noracommerce/issues)** · **[✨ Request Feature](https://github.com/NoramuAIO/Noracommerce/issues)**

Made with ❤️ by NoramuAIO

</div>

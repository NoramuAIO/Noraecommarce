import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...');

  // Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@noramu.com' },
    update: {},
    create: {
      email: 'admin@noramu.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      emailVerified: true,
      balance: 0,
    },
  });

  console.log('✅ Admin kullanıcısı oluşturuldu:', admin.email);

  // Test kullanıcısı oluştur
  const testUserPassword = await bcrypt.hash('test123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@noramu.com' },
    update: {},
    create: {
      email: 'test@noramu.com',
      password: testUserPassword,
      name: 'Test Kullanıcı',
      role: 'user',
      emailVerified: true,
      balance: 100,
    },
  });

  console.log('✅ Test kullanıcısı oluşturuldu:', testUser.email);

  // Kategoriler oluştur
  const categories = [
    { name: 'Ekonomi', slug: 'ekonomi', icon: 'bi-cash-coin' },
    { name: 'PvP', slug: 'pvp', icon: 'bi-sword' },
    { name: 'Yönetim', slug: 'yonetim', icon: 'bi-gear' },
    { name: 'Eğlence', slug: 'eglence', icon: 'bi-controller' },
    { name: 'Koruma', slug: 'koruma', icon: 'bi-shield' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Kategoriler oluşturuldu');

  // Örnek ürünler oluştur
  const ekonomiCategory = await prisma.category.findUnique({ where: { slug: 'ekonomi' } });
  const pvpCategory = await prisma.category.findUnique({ where: { slug: 'pvp' } });

  if (ekonomiCategory) {
    await prisma.product.upsert({
      where: { slug: 'premium-ekonomi-sistemi' },
      update: {},
      create: {
        name: 'Premium Ekonomi Sistemi',
        slug: 'premium-ekonomi-sistemi',
        description: 'Gelişmiş ekonomi yönetim sistemi',
        longDescription: 'Sunucunuz için tam özellikli ekonomi sistemi. Banka, mağaza, ticaret ve daha fazlası.',
        price: 150,
        originalPrice: 200,
        version: '1.0.0',
        minecraftVersions: '1.20,1.21',
        downloads: 0,
        rating: 5.0,
        reviews: 0,
        badge: 'Yeni',
        status: 'active',
        features: JSON.stringify([
          'Banka sistemi',
          'Mağaza entegrasyonu',
          'Ticaret sistemi',
          'Ekonomi istatistikleri',
        ]),
        requirements: JSON.stringify([
          'Minecraft 1.20+',
          'Spigot/Paper sunucu',
          'Java 17+',
        ]),
        updatePolicy: 'lifetime',
        categoryId: ekonomiCategory.id,
      },
    });
  }

  if (pvpCategory) {
    await prisma.product.upsert({
      where: { slug: 'ucretsiz-pvp-arena' },
      update: {},
      create: {
        name: 'Ücretsiz PvP Arena',
        slug: 'ucretsiz-pvp-arena',
        description: 'Basit PvP arena sistemi',
        longDescription: 'Sunucunuz için temel PvP arena özellikleri.',
        price: 0,
        version: '1.0.0',
        minecraftVersions: '1.20,1.21',
        downloads: 0,
        rating: 4.5,
        reviews: 0,
        badge: 'Ücretsiz',
        status: 'active',
        features: JSON.stringify([
          'Temel arena sistemi',
          'Skor tablosu',
          'Basit komutlar',
        ]),
        requirements: JSON.stringify([
          'Minecraft 1.20+',
          'Spigot/Paper sunucu',
        ]),
        updatePolicy: 'lifetime',
        categoryId: pvpCategory.id,
      },
    });
  }

  console.log('✅ Örnek ürünler oluşturuldu');

  // Özellikler oluştur
  const features = [
    {
      title: 'Yüksek Performans',
      description: 'Optimize edilmiş kod yapısı ile sunucunuza minimum yük',
      icon: 'bi-lightning-charge',
      color: 'cyan',
      order: 1,
    },
    {
      title: 'Kolay Kurulum',
      description: 'Detaylı dokümantasyon ve kurulum desteği',
      icon: 'bi-download',
      color: 'purple',
      order: 2,
    },
    {
      title: 'Sürekli Güncelleme',
      description: 'Düzenli güncellemeler ve yeni özellikler',
      icon: 'bi-arrow-repeat',
      color: 'green',
      order: 3,
    },
    {
      title: '7/24 Destek',
      description: 'Her zaman yanınızdayız',
      icon: 'bi-headset',
      color: 'orange',
      order: 4,
    },
  ];

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { id: feature.order },
      update: {},
      create: feature,
    });
  }

  console.log('✅ Özellikler oluşturuldu');

  // Testimonials oluştur
  const testimonials = [
    {
      name: 'Ahmet Y.',
      role: 'Sunucu Sahibi',
      content: 'Noramu pluginleri sayesinde sunucum çok daha profesyonel görünüyor. Teşekkürler!',
      rating: 5,
      order: 1,
    },
    {
      name: 'Mehmet K.',
      role: 'Geliştirici',
      content: 'Kod kalitesi ve performans harika. Kesinlikle tavsiye ederim.',
      rating: 5,
      order: 2,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.order },
      update: {},
      create: testimonial,
    });
  }

  console.log('✅ Testimonials oluşturuldu');

  // FAQ oluştur
  const faqs = [
    {
      question: 'Ürünleri nasıl satın alabilirim?',
      answer: 'Hesap oluşturup bakiye yükledikten sonra istediğiniz ürünü satın alabilirsiniz.',
      category: 'Genel',
      order: 1,
    },
    {
      question: 'Ürünler hangi sürümleri destekliyor?',
      answer: 'Çoğu ürünümüz Minecraft 1.20 ve üzeri sürümleri desteklemektedir.',
      category: 'Teknik',
      order: 2,
    },
    {
      question: 'Destek nasıl alabilirim?',
      answer: 'Discord sunucumuzdan veya destek talebi oluşturarak bize ulaşabilirsiniz.',
      category: 'Destek',
      order: 3,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: faq.order },
      update: {},
      create: faq,
    });
  }

  console.log('✅ FAQ oluşturuldu');

  // Bakiye paketleri oluştur
  const balancePackages = [
    { amount: 50, bonus: 0, price: 50, popular: false },
    { amount: 100, bonus: 10, price: 100, popular: true },
    { amount: 250, bonus: 35, price: 250, popular: false },
    { amount: 500, bonus: 100, price: 500, popular: false },
  ];

  for (const pkg of balancePackages) {
    await prisma.balancePackage.create({
      data: pkg,
    });
  }

  console.log('✅ Bakiye paketleri oluşturuldu');

  // Site ayarları oluştur
  const settings = [
    { key: 'site_name', value: 'Noramu' },
    { key: 'site_description', value: 'Premium Minecraft Pluginleri' },
    { key: 'discord_url', value: 'https://discord.gg/noramu' },
    { key: 'twitter_url', value: 'https://twitter.com/noramu' },
    { key: 'instagram_url', value: 'https://instagram.com/noramu' },
    { key: 'email_verification_required', value: 'false' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'referral_credit_amount', value: '25' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Site ayarları oluşturuldu');

  console.log('🎉 Seed işlemi tamamlandı!');
  console.log('\n📝 Giriş Bilgileri:');
  console.log('Admin: admin@noramu.com / admin123');
  console.log('Test Kullanıcı: test@noramu.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, ShoppingBag, MessageSquare, UserPlus, Save, 
  Loader2, Eye, EyeOff, Server, TestTube, Code, Monitor, RotateCcw, Heart, KeyRound,
  Bell, Send, Gift, Tag, RefreshCw, User, Ticket
} from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

// Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

// Telegram icon component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)


const defaultTemplates: Record<string, { subject: string; html: string }> = {
  welcome: {
    subject: "{{site_name}}'ya Hoş Geldiniz! 🎉",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f1419 0%,#1a1f2e 100%);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(59,130,246,0.15);">
          <!-- Header with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 50%,#06b6d4 100%);padding:40px;text-align:center;">
              <img src="{{site_logo}}" alt="{{site_name}}" style="max-height:60px;margin-bottom:16px;" onerror="this.style.display='none'">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;text-shadow:0 2px 10px rgba(0,0,0,0.3);">Hoş Geldiniz! 🎉</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">Merhaba <strong style="color:#60a5fa;">{{user_name}}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 30px;">{{site_name}} ailesine katıldığınız için teşekkür ederiz! Artık premium içeriklere erişebilirsiniz.</p>
              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1e293b,#0f172a);border-radius:16px;margin-bottom:30px;">
                <tr><td style="padding:20px 24px;border-bottom:1px solid #334155;color:#e2e8f0;font-size:14px;">✨ Premium Minecraft pluginleri</td></tr>
                <tr><td style="padding:20px 24px;border-bottom:1px solid #334155;color:#e2e8f0;font-size:14px;">🛡️ Güvenli ödeme sistemi</td></tr>
                <tr><td style="padding:20px 24px;border-bottom:1px solid #334155;color:#e2e8f0;font-size:14px;">💬 7/24 destek hizmeti</td></tr>
                <tr><td style="padding:20px 24px;color:#e2e8f0;font-size:14px;">🎁 Ücretsiz kaynaklar</td></tr>
              </table>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{site_url}}/products" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 8px 30px rgba(59,130,246,0.4);">Ürünleri Keşfet →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:13px;">{{site_name}} | 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  order: {
    subject: "Sipariş Onayı - #{{order_number}} ✓",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f1419 0%,#1a1f2e 100%);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(59,130,246,0.15);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669 0%,#10b981 50%,#34d399 100%);padding:40px;text-align:center;">
              <img src="{{site_logo}}" alt="{{site_name}}" style="max-height:60px;margin-bottom:16px;" onerror="this.style.display='none'">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Sipariş Onaylandı ✓</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">Merhaba <strong style="color:#60a5fa;">{{user_name}}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 30px;">Siparişiniz başarıyla tamamlandı! Detaylar aşağıda:</p>
              <!-- Order Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1e293b,#0f172a);border-radius:16px;margin-bottom:30px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #334155;">
                    <span style="color:#64748b;font-size:13px;">Sipariş No</span><br>
                    <span style="color:#fff;font-size:16px;font-weight:600;">#{{order_number}}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #334155;">
                    <span style="color:#64748b;font-size:13px;">Ürün</span><br>
                    <span style="color:#fff;font-size:16px;font-weight:600;">{{product_name}}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <span style="color:#64748b;font-size:13px;">Tutar</span><br>
                    <span style="color:#10b981;font-size:20px;font-weight:700;">₺{{amount}}</span>
                  </td>
                </tr>
              </table>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{site_url}}/profile" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 8px 30px rgba(59,130,246,0.4);">Profilime Git →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:13px;">{{site_name}} | 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  ticket_created: {
    subject: "Destek Talebi Oluşturuldu - #{{ticket_id}} 📩",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f1419 0%,#1a1f2e 100%);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(59,130,246,0.15);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 50%,#06b6d4 100%);padding:40px;text-align:center;">
              <img src="{{site_logo}}" alt="{{site_name}}" style="max-height:60px;margin-bottom:16px;" onerror="this.style.display='none'">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Destek Talebi Alındı 📩</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">Merhaba <strong style="color:#60a5fa;">{{user_name}}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 30px;">Destek talebiniz başarıyla oluşturuldu. En kısa sürede size dönüş yapacağız.</p>
              <!-- Ticket Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1e293b,#0f172a);border-radius:16px;margin-bottom:30px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #334155;">
                    <span style="color:#64748b;font-size:13px;">Talep No</span><br>
                    <span style="color:#3b82f6;font-size:18px;font-weight:700;">#{{ticket_id}}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <span style="color:#64748b;font-size:13px;">Konu</span><br>
                    <span style="color:#fff;font-size:16px;font-weight:600;">{{ticket_subject}}</span>
                  </td>
                </tr>
              </table>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{site_url}}/tickets/{{ticket_id}}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 8px 30px rgba(59,130,246,0.4);">Talebimi Görüntüle →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:13px;">{{site_name}} | 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  ticket_reply: {
    subject: "Destek Talebinize Yanıt - #{{ticket_id}} 💬",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f1419 0%,#1a1f2e 100%);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(59,130,246,0.15);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#8b5cf6 50%,#a78bfa 100%);padding:40px;text-align:center;">
              <img src="{{site_logo}}" alt="{{site_name}}" style="max-height:60px;margin-bottom:16px;" onerror="this.style.display='none'">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Yeni Yanıt 💬</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">Merhaba <strong style="color:#60a5fa;">{{user_name}}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 20px;">Destek talebinize yanıt verildi:</p>
              <!-- Ticket Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1e293b,#0f172a);border-radius:12px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <span style="color:#64748b;font-size:12px;">Talep #{{ticket_id}}</span>
                    <span style="color:#475569;margin:0 8px;">•</span>
                    <span style="color:#94a3b8;font-size:13px;">{{ticket_subject}}</span>
                  </td>
                </tr>
              </table>
              <!-- Reply Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1e1b4b,#312e81);border-left:4px solid #8b5cf6;border-radius:12px;margin-bottom:30px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="color:#e2e8f0;font-size:15px;line-height:1.7;margin:0;">{{reply_message}}</p>
                  </td>
                </tr>
              </table>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{site_url}}/tickets/{{ticket_id}}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 8px 30px rgba(59,130,246,0.4);">Yanıtı Görüntüle →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:13px;">{{site_name}} | 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  favorite_update: {
    subject: "Favori Ürününüz Güncellendi: {{product_name}} ❤️",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f1419 0%,#1a1f2e 100%);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(59,130,246,0.15);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#be185d 0%,#ec4899 50%,#f472b6 100%);padding:40px;text-align:center;">
              <img src="{{site_logo}}" alt="{{site_name}}" style="max-height:60px;margin-bottom:16px;" onerror="this.style.display='none'">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Favori Güncellendi ❤️</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">Merhaba <strong style="color:#60a5fa;">{{user_name}}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 30px;">Favori listenizde bulunan <strong style="color:#f472b6;">{{product_name}}</strong> ürünü güncellendi!</p>
              <!-- Change Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1e293b,#0f172a);border-radius:16px;margin-bottom:30px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="color:#94a3b8;font-size:14px;margin:0 0 16px;">{{change_message}}</p>
                    <span style="color:#ef4444;font-size:18px;text-decoration:line-through;">{{old_value}}</span>
                    <span style="color:#64748b;margin:0 12px;font-size:20px;">→</span>
                    <span style="color:#22c55e;font-size:22px;font-weight:700;">{{new_value}}</span>
                  </td>
                </tr>
              </table>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{site_url}}/products/{{product_id}}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 8px 30px rgba(59,130,246,0.4);">Ürünü İncele →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:13px;">{{site_name}} | 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  password_reset: {
    subject: "Şifre Sıfırlama Talebi - {{site_name}} 🔐",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f1419 0%,#1a1f2e 100%);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(59,130,246,0.15);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#b45309 0%,#f59e0b 50%,#fbbf24 100%);padding:40px;text-align:center;">
              <img src="{{site_logo}}" alt="{{site_name}}" style="max-height:60px;margin-bottom:16px;" onerror="this.style.display='none'">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Şifre Sıfırlama 🔐</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">Merhaba <strong style="color:#60a5fa;">{{user_name}}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 30px;">Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <a href="{{reset_url}}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;padding:18px 50px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 8px 30px rgba(59,130,246,0.4);">Şifremi Sıfırla →</a>
                  </td>
                </tr>
              </table>
              <p style="color:#64748b;font-size:13px;text-align:center;margin:0 0 30px;">⏰ Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>
              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#451a03,#78350f);border:1px solid #b45309;border-radius:12px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="color:#fbbf24;font-size:14px;margin:0;">⚠️ Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                  </td>
                </tr>
              </table>
              <!-- Link Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="color:#64748b;font-size:11px;word-break:break-all;margin:0;">{{reset_url}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:13px;">{{site_name}} | 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  email_verification: {
    subject: "Hesabınızı Doğrulayın - {{site_name}} ✓",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f1419 0%,#1a1f2e 100%);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(59,130,246,0.15);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669 0%,#10b981 50%,#34d399 100%);padding:40px;text-align:center;">
              <img src="{{site_logo}}" alt="{{site_name}}" style="max-height:60px;margin-bottom:16px;" onerror="this.style.display='none'">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Hesabınızı Doğrulayın ✓</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">Merhaba <strong style="color:#60a5fa;">{{user_name}}</strong>,</p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 30px;">{{site_name}}'ya hoş geldiniz! Hesabınızı etkinleştirmek için e-postanızı doğrulamanız gerekiyor.</p>
              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#1e293b,#0f172a);border-radius:12px;margin-bottom:30px;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <span style="color:#64748b;font-size:13px;">Doğrulama bağlantısı {{expiry_hours}} saat geçerlidir</span>
                  </td>
                </tr>
              </table>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <a href="{{verification_link}}" style="display:inline-block;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;padding:18px 50px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 8px 30px rgba(16,185,129,0.4);">E-postamı Doğrula →</a>
                  </td>
                </tr>
              </table>
              <p style="color:#64748b;font-size:13px;text-align:center;margin:0 0 30px;">Doğrulama yapılmadan giriş yapamayacaksınız.</p>
              <!-- Link Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="color:#64748b;font-size:11px;word-break:break-all;margin:0;">{{verification_link}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:13px;">{{site_name}} | 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
}


const emailTemplates = [
  { id: 'welcome', name: 'Hoş Geldin', icon: UserPlus, description: 'Yeni kayıt' },
  { id: 'email_verification', name: 'E-posta Doğrulama', icon: Mail, description: 'Hesap doğrulama' },
  { id: 'order', name: 'Sipariş Onayı', icon: ShoppingBag, description: 'Satın alma' },
  { id: 'ticket_created', name: 'Destek Talebi', icon: MessageSquare, description: 'Yeni talep' },
  { id: 'ticket_reply', name: 'Destek Yanıtı', icon: MessageSquare, description: 'Admin yanıtı' },
  { id: 'favorite_update', name: 'Favori Güncelleme', icon: Heart, description: 'Ürün değişikliği' },
  { id: 'password_reset', name: 'Şifre Sıfırlama', icon: KeyRound, description: 'Şifre talebi' },
]

const webhookNotificationTypes = [
  { id: 'Order', name: 'Ürün Satışı', icon: ShoppingBag, description: 'Ücretli ürün satıldığında' },
  { id: 'FreeOrder', name: 'Ücretsiz Ürün', icon: Gift, description: 'Ücretsiz ürün alındığında' },
  { id: 'PriceChange', name: 'Fiyat Değişikliği', icon: Tag, description: 'Ürün fiyatı değiştiğinde' },
  { id: 'ProductUpdate', name: 'Ürün Güncelleme', icon: RefreshCw, description: 'Ürün güncellendiğinde' },
  { id: 'NewUser', name: 'Yeni Kullanıcı', icon: User, description: 'Yeni kayıt olduğunda' },
  { id: 'Ticket', name: 'Destek Talebi', icon: Ticket, description: 'Yeni destek talebi açıldığında' },
]

export default function NotificationsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'email' | 'webhook'>('email')
  const [activeTemplate, setActiveTemplate] = useState('welcome')
  const [showPassword, setShowPassword] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code')
  const [testingWebhook, setTestingWebhook] = useState<'discord' | 'telegram' | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await api.getSettings()
      setSettings(data)
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateSettings(settings)
      showToast('Ayarlar kaydedildi!', 'success')
    } catch (error) {
      showToast('Ayarlar kaydedilemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      showToast('Test e-posta adresi girin', 'warning')
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      await api.testEmail(testEmail)
      setTestResult({ success: true, message: 'Test e-postası gönderildi!' })
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || 'E-posta gönderilemedi' })
    } finally {
      setTesting(false)
    }
  }

  const handleTestWebhook = async (platform: 'discord' | 'telegram') => {
    setTestingWebhook(platform)
    try {
      // Önce ayarları kaydet
      await api.updateSettings(settings)
      
      const response = await api.request('/notifications/test', {
        method: 'POST',
        body: JSON.stringify({ platform })
      }) as { success: boolean; message?: string }
      if (response.success) {
        showToast(`${platform === 'discord' ? 'Discord' : 'Telegram'} test bildirimi gönderildi!`, 'success')
      } else {
        showToast(response.message || 'Bildirim gönderilemedi', 'error')
      }
    } catch (error: any) {
      showToast(error.message || 'Bildirim gönderilemedi', 'error')
    } finally {
      setTestingWebhook(null)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleNotification = (platform: 'Discord' | 'Telegram', type: string) => {
    const key = `notify${platform}${type}`
    const current = settings[key]
    updateSetting(key, current === 'true' ? 'false' : 'true')
  }

  const isNotificationEnabled = (platform: 'Discord' | 'Telegram', type: string) => {
    const key = `notify${platform}${type}`
    return settings[key] !== 'false'
  }

  const getCurrentTemplate = () => {
    const subjectKey = `email_${activeTemplate}_subject`
    const htmlKey = `email_${activeTemplate}_html`
    return {
      subject: settings[subjectKey] || defaultTemplates[activeTemplate]?.subject || '',
      html: settings[htmlKey] || defaultTemplates[activeTemplate]?.html || ''
    }
  }

  const resetToDefault = () => {
    if (confirm('Şablonu varsayılana sıfırlamak istediğinize emin misiniz?')) {
      const def = defaultTemplates[activeTemplate]
      if (def) {
        updateSetting(`email_${activeTemplate}_subject`, def.subject)
        updateSetting(`email_${activeTemplate}_html`, def.html)
      }
    }
  }

  const getPreviewHtml = () => {
    const template = getCurrentTemplate()
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    const logoUrl = settings.siteLogo ? (settings.siteLogo.startsWith('http') ? settings.siteLogo : `${API_URL}${settings.siteLogo}`) : ''
    
    return template.html
      .replace(/\{\{site_name\}\}/g, settings.siteName || 'Noramu')
      .replace(/\{\{site_logo\}\}/g, logoUrl)
      .replace(/\{\{site_url\}\}/g, 'http://localhost:3000')
      .replace(/\{\{user_name\}\}/g, 'Test Kullanıcı')
      .replace(/\{\{user_email\}\}/g, 'test@example.com')
      .replace(/\{\{order_number\}\}/g, 'ORD-123456')
      .replace(/\{\{product_name\}\}/g, 'Örnek Plugin')
      .replace(/\{\{product_id\}\}/g, '1')
      .replace(/\{\{amount\}\}/g, '99.90')
      .replace(/\{\{ticket_id\}\}/g, '42')
      .replace(/\{\{ticket_subject\}\}/g, 'Örnek Destek Talebi')
      .replace(/\{\{reply_message\}\}/g, 'Bu bir örnek yanıt mesajıdır. Destek ekibimiz talebinizi inceledi ve size yardımcı olmak için burada.')
      .replace(/\{\{change_message\}\}/g, 'Fiyat düştü!')
      .replace(/\{\{old_value\}\}/g, '₺149.90')
      .replace(/\{\{new_value\}\}/g, '₺99.90')
      .replace(/\{\{reset_url\}\}/g, 'http://localhost:3000/reset-password?token=abc123')
      .replace(/\{\{verification_link\}\}/g, 'http://localhost:3000/verify-email?token=abc123')
      .replace(/\{\{expiry_hours\}\}/g, '24')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const currentTemplate = getCurrentTemplate()


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bildirim Ayarları</h1>
          <p className="text-gray-500 mt-1">E-posta ve webhook bildirimlerini yönetin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Kaydet
        </motion.button>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'email'
              ? 'bg-violet-600 text-white'
              : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Mail className="w-4 h-4" />
          E-posta
        </button>
        <button
          onClick={() => setActiveTab('webhook')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'webhook'
              ? 'bg-violet-600 text-white'
              : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Bell className="w-4 h-4" />
          Discord / Telegram
        </button>
      </div>

      {activeTab === 'email' ? (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sol Panel - SMTP & Şablon Listesi */}
          <div className="space-y-4">
            {/* SMTP Ayarları */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-violet-400" />
                <h3 className="font-medium text-white">SMTP Ayarları</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={settings.smtp_host || ''}
                  onChange={(e) => updateSetting('smtp_host', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600"
                />
                <input
                  type="text"
                  value={settings.smtp_port || ''}
                  onChange={(e) => updateSetting('smtp_port', e.target.value)}
                  placeholder="Port: 587"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600"
                />
                <input
                  type="email"
                  value={settings.smtp_user || ''}
                  onChange={(e) => updateSetting('smtp_user', e.target.value)}
                  placeholder="E-posta"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600"
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.smtp_pass || ''}
                    onChange={(e) => updateSetting('smtp_pass', e.target.value)}
                    placeholder="Şifre"
                    className="w-full px-3 py-2 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Test E-posta */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TestTube className="w-5 h-5 text-emerald-400" />
                <h3 className="font-medium text-white">Test</h3>
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600"
                />
                <button
                  onClick={handleTestEmail}
                  disabled={testing}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm disabled:opacity-50"
                >
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>Gönder</span>
                </button>
              </div>
              {testResult && (
                <p className={`mt-2 text-xs ${testResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {testResult.message}
                </p>
              )}
            </div>

            {/* Şablon Listesi */}
            <div className="glass-card p-4">
              <h3 className="font-medium text-white mb-3">Şablonlar</h3>
              <div className="space-y-1">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      activeTemplate === template.id
                        ? 'bg-violet-600/20 border border-violet-500/30'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <template.icon className={`w-4 h-4 ${activeTemplate === template.id ? 'text-violet-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${activeTemplate === template.id ? 'text-white' : 'text-gray-300'}`}>
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Editör */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-card p-4">
              <label className="text-sm text-gray-400 mb-2 block">E-posta Konusu</label>
              <input
                type="text"
                value={currentTemplate.subject}
                onChange={(e) => updateSetting(`email_${activeTemplate}_subject`, e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              />
            </div>

            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('code')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${viewMode === 'code' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Code className="w-4 h-4" />
                    HTML Kodu
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${viewMode === 'preview' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Monitor className="w-4 h-4" />
                    Önizleme
                  </button>
                </div>
                <button
                  onClick={resetToDefault}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                  Varsayılana Sıfırla
                </button>
              </div>

              {viewMode === 'code' ? (
                <textarea
                  value={currentTemplate.html}
                  onChange={(e) => updateSetting(`email_${activeTemplate}_html`, e.target.value)}
                  className="w-full h-[500px] p-4 bg-[#0d0d0d] text-gray-300 font-mono text-sm resize-none focus:outline-none whitespace-pre"
                  spellCheck={false}
                  wrap="off"
                />
              ) : (
                <div className="h-[500px] bg-[#0a0a0f] overflow-hidden">
                  <iframe
                    srcDoc={getPreviewHtml()}
                    className="w-full h-full border-0"
                    title="E-posta Önizleme"
                    sandbox="allow-same-origin"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <WebhookSettings
          settings={settings}
          updateSetting={updateSetting}
          isNotificationEnabled={isNotificationEnabled}
          toggleNotification={toggleNotification}
          testingWebhook={testingWebhook}
          handleTestWebhook={handleTestWebhook}
        />
      )}
    </div>
  )
}


// Webhook Settings Component
function WebhookSettings({
  settings,
  updateSetting,
  isNotificationEnabled,
  toggleNotification,
  testingWebhook,
  handleTestWebhook
}: {
  settings: Record<string, string>
  updateSetting: (key: string, value: string) => void
  isNotificationEnabled: (platform: 'Discord' | 'Telegram', type: string) => boolean
  toggleNotification: (platform: 'Discord' | 'Telegram', type: string) => void
  testingWebhook: 'discord' | 'telegram' | null
  handleTestWebhook: (platform: 'discord' | 'telegram') => void
}) {
  const [showTelegramToken, setShowTelegramToken] = useState(false)

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Discord Webhook */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
            <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Discord Webhook</h3>
            <p className="text-sm text-gray-500">Discord kanalına bildirim gönder</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Webhook URL</label>
            <input
              type="text"
              value={settings.discordWebhookUrl || ''}
              onChange={(e) => updateSetting('discordWebhookUrl', e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600"
            />
            <p className="text-xs text-gray-500 mt-2">
              Discord sunucu ayarları → Entegrasyonlar → Webhooks → Yeni Webhook
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-3 block">Bildirim Türleri</label>
            <div className="space-y-2">
              {webhookNotificationTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <type.icon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-white">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  <div
                    onClick={() => toggleNotification('Discord', type.id)}
                    className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                      isNotificationEnabled('Discord', type.id) ? 'bg-[#5865F2]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${
                        isNotificationEnabled('Discord', type.id) ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleTestWebhook('discord')}
            disabled={testingWebhook === 'discord' || !settings.discordWebhookUrl}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl text-white font-medium disabled:opacity-50 transition-colors"
          >
            {testingWebhook === 'discord' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Test Bildirimi Gönder
          </button>
        </div>
      </div>

      {/* Telegram Bot */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 flex items-center justify-center">
            <TelegramIcon className="w-5 h-5 text-[#0088cc]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Telegram Bot</h3>
            <p className="text-sm text-gray-500">Telegram grubuna bildirim gönder</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Bot Token</label>
            <div className="relative">
              <input
                type={showTelegramToken ? 'text' : 'password'}
                value={settings.telegramBotToken || ''}
                onChange={(e) => updateSetting('telegramBotToken', e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="w-full px-4 py-3 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowTelegramToken(!showTelegramToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showTelegramToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              @BotFather ile bot oluşturup token alın
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Chat ID</label>
            <input
              type="text"
              value={settings.telegramChatId || ''}
              onChange={(e) => updateSetting('telegramChatId', e.target.value)}
              placeholder="-1001234567890"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600"
            />
            <p className="text-xs text-gray-500 mt-2">
              Grup veya kanal ID'si (- ile başlar)
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-3 block">Bildirim Türleri</label>
            <div className="space-y-2">
              {webhookNotificationTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <type.icon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-white">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  <div
                    onClick={() => toggleNotification('Telegram', type.id)}
                    className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                      isNotificationEnabled('Telegram', type.id) ? 'bg-[#0088cc]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${
                        isNotificationEnabled('Telegram', type.id) ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleTestWebhook('telegram')}
            disabled={testingWebhook === 'telegram' || !settings.telegramBotToken || !settings.telegramChatId}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0088cc] hover:bg-[#006699] rounded-xl text-white font-medium disabled:opacity-50 transition-colors"
          >
            {testingWebhook === 'telegram' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Test Bildirimi Gönder
          </button>
        </div>
      </div>
    </div>
  )
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscordService {
  constructor(private prisma: PrismaService) {}

  // Ayarlardan Discord bot token ve guild ID al
  private async getDiscordSettings() {
    const settings = await this.prisma.settings.findMany({
      where: {
        key: {
          in: ['discordBotToken', 'discordGuildId', 'discordCustomerRoleId', 'discordPremiumRoleId']
        }
      }
    });
    
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  }

  // Discord API ile rol ver
  async addRoleToUser(discordId: string, roleId: string): Promise<boolean> {
    try {
      const settings = await this.getDiscordSettings();
      const { discordBotToken, discordGuildId } = settings;

      if (!discordBotToken || !discordGuildId || !roleId) {
        console.log('Discord ayarları eksik');
        return false;
      }

      const response = await fetch(
        `https://discord.com/api/v10/guilds/${discordGuildId}/members/${discordId}/roles/${roleId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bot ${discordBotToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok || response.status === 204) {
        console.log(`Discord rol verildi: User ${discordId}, Role ${roleId}`);
        return true;
      } else {
        const error = await response.text();
        console.error('Discord rol verme hatası:', error);
        return false;
      }
    } catch (error) {
      console.error('Discord API hatası:', error);
      return false;
    }
  }

  // Kullanıcıya müşteri rolü ver
  async giveCustomerRole(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.discordId) {
      console.log('Kullanıcının Discord ID\'si yok');
      return false;
    }

    const settings = await this.getDiscordSettings();
    const roleId = settings.discordCustomerRoleId;
    
    if (!roleId) {
      console.log('Müşteri rol ID\'si ayarlanmamış');
      return false;
    }

    return this.addRoleToUser(user.discordId, roleId);
  }

  // Kullanıcıya premium rolü ver (ücretli ürün aldığında)
  async givePremiumRole(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.discordId) {
      console.log('Kullanıcının Discord ID\'si yok');
      return false;
    }

    const settings = await this.getDiscordSettings();
    const roleId = settings.discordPremiumRoleId;
    
    if (!roleId) {
      console.log('Premium rol ID\'si ayarlanmamış');
      return false;
    }

    return this.addRoleToUser(user.discordId, roleId);
  }

  // Sipariş tamamlandığında rol ver
  async handleOrderCompleted(userId: number, isPaid: boolean, productId?: number): Promise<void> {
    // Müşteri rolü her zaman ver
    await this.giveCustomerRole(userId);
    
    // Ücretli ürün aldıysa premium rolü de ver
    if (isPaid) {
      await this.givePremiumRole(userId);
    }

    // Ürüne özel rol ver
    if (productId) {
      await this.giveProductRole(userId, productId);
    }
  }

  // Ürüne özel rol ver
  async giveProductRole(userId: number, productId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.discordId) {
      console.log('Kullanıcının Discord ID\'si yok');
      return false;
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product?.discordRoleId) {
      console.log('Ürüne Discord rolü atanmamış');
      return false;
    }

    return this.addRoleToUser(user.discordId, product.discordRoleId);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, products, orders, tickets] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.ticket.count({ where: { status: 'open' } }),
    ]);

    // Sipariş gelirleri
    const orderRevenue = await this.prisma.order.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true },
    });

    // Bakiye yüklemelerinden gelen gelir (isRevenue: true olanlar)
    const balanceRevenue = await this.prisma.balanceTransaction.aggregate({
      where: { isRevenue: true, type: 'add' },
      _sum: { amount: true },
    });

    // Toplam gider (isExpense: true olanlar)
    const totalExpense = await this.prisma.balanceTransaction.aggregate({
      where: { isExpense: true },
      _sum: { amount: true },
    });

    const totalRevenue = (orderRevenue._sum.amount || 0) + (balanceRevenue._sum.amount || 0);

    // Son 7 gün gelir grafiği
    const last7Days = await this.getLast7DaysRevenue();
    
    // Son 30 gün sipariş grafiği
    const last30DaysOrders = await this.getLast30DaysOrders();
    
    // Ürün kategorilerine göre satış
    const salesByCategory = await this.getSalesByCategory();
    
    // Bugünkü vs dünkü karşılaştırma
    const todayStats = await this.getTodayStats();

    // Son 7 gün gelir/gider detayları
    const recentTransactions = await this.getRecentTransactions();

    return {
      totalUsers: users,
      totalProducts: products,
      totalOrders: orders,
      openTickets: tickets,
      totalRevenue,
      totalExpense: totalExpense._sum.amount || 0,
      recentTransactions,
      charts: {
        revenueChart: last7Days,
        ordersChart: last30DaysOrders,
        categoryChart: salesByCategory,
      },
      todayStats,
    };
  }

  private async getRecentTransactions() {
    // Tüm siparişleri al
    const orders = await this.prisma.order.findMany({
      where: { status: 'completed' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Tüm bakiye işlemlerini al
    const balanceTransactions = await this.prisma.balanceTransaction.findMany({
      where: { OR: [{ isRevenue: true }, { isExpense: true }] },
      orderBy: { createdAt: 'desc' },
    });

    // User bilgilerini al
    const userIds = [...new Set(balanceTransactions.map(t => t.userId))];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    // Gelirler
    const revenues = [
      ...orders.map(o => ({
        id: `order-${o.id}`,
        source: 'order',
        amount: o.amount,
        description: o.product?.name || 'Ürün Satışı',
        user: o.user,
        createdAt: o.createdAt,
      })),
      ...balanceTransactions.filter(t => t.isRevenue).map(t => ({
        id: `balance-${t.id}`,
        source: 'balance',
        amount: t.amount,
        description: 'Bakiye Yüklemesi',
        user: userMap.get(t.userId) || { id: t.userId, name: 'Bilinmiyor', email: '' },
        createdAt: t.createdAt,
        note: t.note,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Giderler
    const expenses = balanceTransactions.filter(t => t.isExpense).map(t => ({
      id: `balance-${t.id}`,
      source: 'balance',
      amount: t.amount,
      description: 'Bakiye Düşümü',
      user: userMap.get(t.userId) || { id: t.userId, name: 'Bilinmiyor', email: '' },
      createdAt: t.createdAt,
      note: t.note,
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { revenues, expenses };
  }

  private async getLast7DaysRevenue() {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const [orderRevenue, balanceRevenue, balanceExpense] = await Promise.all([
        this.prisma.order.aggregate({
          where: {
            status: 'completed',
            createdAt: { gte: date, lt: nextDate },
          },
          _sum: { amount: true },
        }),
        this.prisma.balanceTransaction.aggregate({
          where: {
            isRevenue: true,
            type: 'add',
            createdAt: { gte: date, lt: nextDate },
          },
          _sum: { amount: true },
        }),
        this.prisma.balanceTransaction.aggregate({
          where: {
            isExpense: true,
            createdAt: { gte: date, lt: nextDate },
          },
          _sum: { amount: true },
        }),
      ]);
      
      days.push({
        date: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        revenue: (orderRevenue._sum.amount || 0) + (balanceRevenue._sum.amount || 0),
        expense: balanceExpense._sum.amount || 0,
      });
    }
    
    return days;
  }

  private async getLast30DaysOrders() {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await this.prisma.order.count({
        where: {
          createdAt: { gte: date, lt: nextDate },
        },
      });
      
      days.push({
        date: date.getDate().toString(),
        orders: count,
      });
    }
    
    return days;
  }

  private async getSalesByCategory() {
    const categories = await this.prisma.category.findMany({
      include: {
        products: {
          include: {
            orders: { where: { status: 'completed' } },
          },
        },
      },
    });
    
    return categories.map(cat => ({
      name: cat.name,
      sales: cat.products.reduce((sum, p) => sum + p.orders.length, 0),
      revenue: cat.products.reduce((sum, p) => 
        sum + p.orders.reduce((s, o) => s + o.amount, 0), 0
      ),
    })).filter(c => c.sales > 0);
  }

  private async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayOrders, yesterdayOrders, 
      todayOrderRevenue, yesterdayOrderRevenue, 
      todayBalanceRevenue, yesterdayBalanceRevenue,
      todayUsers, yesterdayUsers
    ] = await Promise.all([
      this.prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.order.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
      this.prisma.order.aggregate({ where: { status: 'completed', createdAt: { gte: today, lt: tomorrow } }, _sum: { amount: true } }),
      this.prisma.order.aggregate({ where: { status: 'completed', createdAt: { gte: yesterday, lt: today } }, _sum: { amount: true } }),
      this.prisma.balanceTransaction.aggregate({ where: { isRevenue: true, type: 'add', createdAt: { gte: today, lt: tomorrow } }, _sum: { amount: true } }),
      this.prisma.balanceTransaction.aggregate({ where: { isRevenue: true, type: 'add', createdAt: { gte: yesterday, lt: today } }, _sum: { amount: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.user.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
    ]);

    const todayRevenue = (todayOrderRevenue._sum.amount || 0) + (todayBalanceRevenue._sum.amount || 0);
    const yesterdayRevenue = (yesterdayOrderRevenue._sum.amount || 0) + (yesterdayBalanceRevenue._sum.amount || 0);

    return {
      todayOrders,
      yesterdayOrders,
      ordersChange: yesterdayOrders > 0 ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1) : todayOrders > 0 ? 100 : 0,
      todayRevenue,
      yesterdayRevenue,
      revenueChange: yesterdayRevenue > 0 
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) 
        : todayRevenue > 0 ? 100 : 0,
      todayUsers,
      yesterdayUsers,
      usersChange: yesterdayUsers > 0 ? ((todayUsers - yesterdayUsers) / yesterdayUsers * 100).toFixed(1) : todayUsers > 0 ? 100 : 0,
    };
  }

  async getPublicStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [products, users, orders, todayTickets, todayResolvedTickets, recentTicketsWithResponse] = await Promise.all([
      this.prisma.product.count({ where: { status: 'active' } }),
      this.prisma.user.count(),
      this.prisma.order.count(),
      // Bugün oluşturulan ticketlar
      this.prisma.ticket.count({
        where: { createdAt: { gte: today } }
      }),
      // Bugün çözülen ticketlar
      this.prisma.ticket.count({
        where: { 
          createdAt: { gte: today },
          status: { in: ['resolved', 'closed'] }
        }
      }),
      // Son 30 gündeki yanıtlanmış ticketlar (ortalama yanıt süresi için)
      this.prisma.ticket.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          replies: { some: { isAdmin: true } }
        },
        include: {
          replies: {
            where: { isAdmin: true },
            orderBy: { createdAt: 'asc' },
            take: 1
          }
        }
      })
    ]);

    // Ortalama yanıt süresini hesapla (dakika cinsinden)
    let avgResponseTime: number | null = null;
    if (recentTicketsWithResponse.length > 0) {
      const responseTimes = recentTicketsWithResponse
        .filter(t => t.replies.length > 0)
        .map(t => {
          const ticketCreated = new Date(t.createdAt).getTime();
          const firstResponse = new Date(t.replies[0].createdAt).getTime();
          return (firstResponse - ticketCreated) / (1000 * 60); // dakika
        });
      
      if (responseTimes.length > 0) {
        avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
      }
    }

    // Bugün çözülme oranı - sadece ticket varsa hesapla
    let todayResolved: number | null = null;
    if (todayTickets > 0) {
      todayResolved = Math.round((todayResolvedTickets / todayTickets) * 100);
    }

    return {
      products,
      users,
      orders,
      avgResponseTime,
      todayResolved,
      hasTicketStats: avgResponseTime !== null || todayResolved !== null
    };
  }
}

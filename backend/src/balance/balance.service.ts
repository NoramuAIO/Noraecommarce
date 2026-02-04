import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  // Balance Packages
  async findAllPackages() {
    return this.prisma.balancePackage.findMany({ orderBy: { amount: 'asc' } });
  }

  async createPackage(data: { amount: number; bonus: number; price: number; popular?: boolean }) {
    return this.prisma.balancePackage.create({ data });
  }

  async updatePackage(id: number, data: any) {
    return this.prisma.balancePackage.update({ where: { id }, data });
  }

  async deletePackage(id: number) {
    return this.prisma.balancePackage.delete({ where: { id } });
  }

  // User Balance
  async addBalance(userId: number, amount: number, bonus: number = 0) {
    const totalAmount = amount + bonus;
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: totalAmount } },
    });
  }

  async deductBalance(userId: number, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < amount) {
      throw new Error('Yetersiz bakiye');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, balance: true, createdAt: true },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByResetToken(token: string) {
    return this.prisma.user.findFirst({ where: { resetToken: token } });
  }

  async findByEmailVerificationToken(token: string) {
    return this.prisma.user.findFirst({ where: { emailVerificationToken: token } });
  }

  async create(data: {
    email: string;
    password: string;
    name: string;
    avatar?: string;
    discordId?: string;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
    emailVerified?: boolean;
  }) {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateBalance(id: number, amount: number) {
    return this.prisma.user.update({
      where: { id },
      data: { balance: { increment: amount } },
    });
  }

  async updateBalanceWithTransaction(
    userId: number, 
    newBalance: number, 
    type: string, 
    isRevenue: boolean,
    adminId?: number,
    note?: string
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const previousBalance = user.balance;
    const amount = Math.abs(newBalance - previousBalance);

    // Transaction oluştur ve bakiyeyi güncelle
    await this.prisma.balanceTransaction.create({
      data: {
        userId,
        amount,
        type,
        previousBalance,
        newBalance,
        isRevenue: type === 'add' ? isRevenue : false,
        isExpense: type === 'subtract' ? true : false,
        adminId,
        note,
      },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

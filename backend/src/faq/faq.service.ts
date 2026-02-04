import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    const where = category ? { category } : {};
    return this.prisma.fAQ.findMany({ where, orderBy: { order: 'asc' } });
  }

  async findById(id: number) {
    return this.prisma.fAQ.findUnique({ where: { id } });
  }

  async create(data: { question: string; answer: string; category: string; order?: number }) {
    return this.prisma.fAQ.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.fAQ.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.fAQ.delete({ where: { id } });
  }
}

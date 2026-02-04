import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.feature.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.feature.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async create(data: { title: string; description: string; icon: string; color: string }) {
    const count = await this.prisma.feature.count();
    return this.prisma.feature.create({
      data: {
        ...data,
        order: count,
      },
    });
  }

  async update(id: number, data: Partial<{ title: string; description: string; icon: string; color: string; order: number; active: boolean }>) {
    return this.prisma.feature.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.feature.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
  }

  async findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async create(data: { name: string; icon: string }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    return this.prisma.category.create({ data: { ...data, slug } });
  }

  async update(id: number, data: any) {
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}

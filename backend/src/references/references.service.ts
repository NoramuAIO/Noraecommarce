import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferencesService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    const where = activeOnly ? { active: true } : {};
    return this.prisma.reference.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.reference.findUnique({ where: { id } });
  }

  async create(data: { name: string; image: string; website?: string; discord?: string }) {
    return this.prisma.reference.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.reference.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.reference.delete({ where: { id } });
  }
}

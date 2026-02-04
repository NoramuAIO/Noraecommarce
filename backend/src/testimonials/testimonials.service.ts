import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async create(data: { name: string; role: string; content: string; rating: number }) {
    const count = await this.prisma.testimonial.count();
    return this.prisma.testimonial.create({
      data: { ...data, order: count },
    });
  }

  async update(id: number, data: Partial<{ name: string; role: string; content: string; rating: number; order: number; active: boolean }>) {
    return this.prisma.testimonial.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.testimonial.delete({ where: { id } });
  }
}

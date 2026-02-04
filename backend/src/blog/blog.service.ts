import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Okuma süresini hesapla (ortalama 200 kelime/dakika)
  private calculateReadTime(content: string): string {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} dk`;
  }

  // Blog Posts
  async findAll(categoryId?: number) {
    const where = categoryId ? { categoryId } : {};
    return this.prisma.blogPost.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.blogPost.findUnique({ 
      where: { id },
      include: { category: true }
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.blogPost.findUnique({ 
      where: { slug },
      include: { category: true }
    });
  }

  async create(data: any) {
    const baseSlug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const slug = `${baseSlug}-${Date.now()}`;
    const readTime = this.calculateReadTime(data.content || '');
    return this.prisma.blogPost.create({ 
      data: { ...data, slug, readTime },
      include: { category: true }
    });
  }

  async update(id: number, data: any) {
    if (data.content) {
      data.readTime = this.calculateReadTime(data.content);
    }
    return this.prisma.blogPost.update({ 
      where: { id }, 
      data,
      include: { category: true }
    });
  }

  async delete(id: number) {
    return this.prisma.blogPost.delete({ where: { id } });
  }

  // Blog Categories
  async findAllCategories() {
    return this.prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: { name: string }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.blogCategory.create({ data: { ...data, slug } });
  }

  async updateCategory(id: number, data: { name: string }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return this.prisma.blogCategory.update({ where: { id }, data: { ...data, slug } });
  }

  async deleteCategory(id: number) {
    // Önce bu kategorideki postları kategorisiz yap
    await this.prisma.blogPost.updateMany({
      where: { categoryId: id },
      data: { categoryId: null }
    });
    return this.prisma.blogCategory.delete({ where: { id } });
  }
}

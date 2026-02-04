"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateReadTime(content) {
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} dk`;
    }
    async findAll(categoryId) {
        const where = categoryId ? { categoryId } : {};
        return this.prisma.blogPost.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.blogPost.findUnique({
            where: { id },
            include: { category: true }
        });
    }
    async findBySlug(slug) {
        return this.prisma.blogPost.findUnique({
            where: { slug },
            include: { category: true }
        });
    }
    async create(data) {
        const baseSlug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const slug = `${baseSlug}-${Date.now()}`;
        const readTime = this.calculateReadTime(data.content || '');
        return this.prisma.blogPost.create({
            data: { ...data, slug, readTime },
            include: { category: true }
        });
    }
    async update(id, data) {
        if (data.content) {
            data.readTime = this.calculateReadTime(data.content);
        }
        return this.prisma.blogPost.update({
            where: { id },
            data,
            include: { category: true }
        });
    }
    async delete(id) {
        return this.prisma.blogPost.delete({ where: { id } });
    }
    async findAllCategories() {
        return this.prisma.blogCategory.findMany({
            include: { _count: { select: { posts: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(data) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return this.prisma.blogCategory.create({ data: { ...data, slug } });
    }
    async updateCategory(id, data) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return this.prisma.blogCategory.update({ where: { id }, data: { ...data, slug } });
    }
    async deleteCategory(id) {
        await this.prisma.blogPost.updateMany({
            where: { categoryId: id },
            data: { categoryId: null }
        });
        return this.prisma.blogCategory.delete({ where: { id } });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map
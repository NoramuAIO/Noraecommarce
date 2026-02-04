import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  // Blog Posts
  @Get()
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.blogService.findAll(categoryId ? +categoryId : undefined);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      return this.blogService.findBySlug(id);
    }
    return this.blogService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() data: any) {
    return this.blogService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.blogService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.blogService.delete(+id);
  }

  // Blog Categories
  @Get('categories/all')
  async findAllCategories() {
    return this.blogService.findAllCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createCategory(@Body() data: { name: string }) {
    return this.blogService.createCategory(data);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateCategory(@Param('id') id: string, @Body() data: { name: string }) {
    return this.blogService.updateCategory(+id, data);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteCategory(@Param('id') id: string) {
    return this.blogService.deleteCategory(+id);
  }
}

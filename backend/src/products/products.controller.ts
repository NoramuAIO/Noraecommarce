import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { FavoritesService } from '../favorites/favorites.service';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private favoritesService: FavoritesService,
  ) {}

  @Get()
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.productsService.findAll(categoryId ? +categoryId : undefined);
  }

  // Sadece ücretli ürünler
  @Get('paid')
  async findPaid(@Query('categoryId') categoryId?: string) {
    return this.productsService.findPaid(categoryId ? +categoryId : undefined);
  }

  // Sadece ücretsiz ürünler
  @Get('free')
  async findFree() {
    return this.productsService.findFree();
  }

  // En çok satan ürünler
  @Get('best-sellers')
  async findBestSellers(@Query('limit') limit?: string) {
    return this.productsService.findBestSellers(limit ? +limit : 8);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      return this.productsService.findBySlug(id);
    }
    return this.productsService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() data: any) {
    return this.productsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.productsService.update(+id, data, this.favoritesService.notifyFavoriteUsers.bind(this.favoritesService));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }

  // Changelog endpoints
  @Get(':id/changelogs')
  async getChangelogs(@Param('id') id: string) {
    return this.productsService.getChangelogs(+id);
  }

  @Post(':id/changelogs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createChangelog(@Param('id') id: string, @Body() data: { version: string; changes: string[] }) {
    return this.productsService.createChangelog(+id, data, this.favoritesService.notifyFavoriteUsers.bind(this.favoritesService));
  }

  @Delete('changelogs/:changelogId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteChangelog(@Param('changelogId') changelogId: string) {
    return this.productsService.deleteChangelog(+changelogId);
  }

  // Review endpoints
  @Get(':id/reviews')
  async getReviews(@Param('id') id: string) {
    return this.productsService.getReviews(+id);
  }

  @Get(':id/reviews/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getReviewsAdmin(@Param('id') id: string) {
    return this.productsService.getReviews(+id, true);
  }

  @Post(':id/reviews')
  async createReview(@Param('id') id: string, @Body() data: { rating: number; comment: string; userName: string }) {
    return this.productsService.createReview(+id, data);
  }

  @Put('reviews/:reviewId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateReview(@Param('reviewId') reviewId: string, @Body() data: { approved?: boolean }) {
    return this.productsService.updateReview(+reviewId, data);
  }

  @Delete('reviews/:reviewId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteReview(@Param('reviewId') reviewId: string) {
    return this.productsService.deleteReview(+reviewId);
  }

  // Tüm yorumları admin için getir
  @Get('admin/reviews/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllReviewsAdmin() {
    return this.productsService.getAllReviewsAdmin();
  }
}

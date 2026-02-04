import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async addFavorite(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.addFavorite(req.user.id, +productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async removeFavorite(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.removeFavorite(req.user.id, +productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:productId')
  async isFavorite(@Request() req, @Param('productId') productId: string) {
    const isFav = await this.favoritesService.isFavorite(req.user.id, +productId);
    return { isFavorite: isFav };
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotifications(@Request() req) {
    return this.favoritesService.getUserNotifications(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/:id/read')
  async markNotificationRead(@Request() req, @Param('id') id: string) {
    return this.favoritesService.markNotificationRead(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/read-all')
  async markAllNotificationsRead(@Request() req) {
    return this.favoritesService.markAllNotificationsRead(req.user.id);
  }
}

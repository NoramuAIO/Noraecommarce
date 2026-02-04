import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  async getPublicStats() {
    return this.statsService.getPublicStats();
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}

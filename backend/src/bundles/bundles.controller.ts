import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BundlesService } from './bundles.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bundles')
export class BundlesController {
  constructor(private bundlesService: BundlesService) {}

  @Post('calculate-discount')
  async calculateDiscount(@Body() data: { bundleId: number; productId: number; amount: number }) {
    return this.bundlesService.calculateDiscount(data.bundleId, data.productId, data.amount);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() data: any) {
    return this.bundlesService.create(data);
  }

  @Get()
  async getAll() {
    return this.bundlesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.bundlesService.getById(parseInt(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.bundlesService.update(parseInt(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    return this.bundlesService.delete(parseInt(id));
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PopupsService } from './popups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('popups')
export class PopupsController {
  constructor(private popupsService: PopupsService) {}

  @Get('active')
  async getActive() {
    return this.popupsService.getActive();
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAll() {
    return this.popupsService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getById(@Param('id') id: string) {
    return this.popupsService.getById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() data: any) {
    return this.popupsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.popupsService.update(parseInt(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    return this.popupsService.delete(parseInt(id));
  }
}

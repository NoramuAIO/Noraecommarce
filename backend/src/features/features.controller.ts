import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('features')
export class FeaturesController {
  constructor(private featuresService: FeaturesService) {}

  @Get()
  async findAll() {
    return this.featuresService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAllAdmin() {
    return this.featuresService.findAllAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() data: { title: string; description: string; icon: string; color: string }) {
    return this.featuresService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.featuresService.update(parseInt(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.featuresService.delete(parseInt(id));
  }
}

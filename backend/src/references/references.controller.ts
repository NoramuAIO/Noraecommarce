import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('references')
export class ReferencesController {
  constructor(private referencesService: ReferencesService) {}

  @Get()
  async findAll() {
    return this.referencesService.findAll(true);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAllAdmin() {
    return this.referencesService.findAll(false);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.referencesService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() data: { name: string; image: string; website?: string; discord?: string }) {
    return this.referencesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.referencesService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.referencesService.delete(+id);
  }
}

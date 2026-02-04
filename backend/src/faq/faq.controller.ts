import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    return this.faqService.findAll(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.faqService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() data: any) {
    return this.faqService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.faqService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.faqService.delete(+id);
  }
}

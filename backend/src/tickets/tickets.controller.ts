import { Controller, Get, Post, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll() {
    return this.ticketsService.findAll();
  }

  @Get('my')
  async findMyTickets(@Request() req) {
    return this.ticketsService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findById(+id);
  }

  @Post()
  async create(@Request() req, @Body() data: { subject: string; message: string; category: string; priority?: string }) {
    return this.ticketsService.create(req.user.id, data);
  }

  @Post(':id/reply')
  async addReply(@Request() req, @Param('id') id: string, @Body() data: { message: string }) {
    const isAdmin = req.user.role === 'admin';
    const adminName = isAdmin ? req.user.name : null;
    return this.ticketsService.addReply(+id, data.message, isAdmin, adminName);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.ticketsService.updateStatus(+id, data.status);
  }

  @Put(':id/note')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateAdminNote(@Param('id') id: string, @Body() data: { adminNote: string }) {
    return this.ticketsService.updateAdminNote(+id, data.adminNote);
  }

  @Put(':id/close')
  async close(@Param('id') id: string) {
    return this.ticketsService.close(+id);
  }
}

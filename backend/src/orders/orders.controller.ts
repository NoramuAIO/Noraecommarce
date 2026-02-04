import { Controller, Get, Post, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('my')
  async findMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findById(+id);
  }

  @Post()
  async create(@Request() req, @Body() data: { productId: number; paymentMethod: string; couponCode?: string }) {
    return this.ordersService.create(req.user.id, data.productId, data.paymentMethod, data.couponCode);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.ordersService.updateStatus(+id, data.status);
  }
}

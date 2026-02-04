import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body()
    data: {
      code: string;
      description?: string;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
      maxUses?: number;
      expiresAt?: string;
      usableInCart?: boolean;
      productIds?: number[];
    }
  ) {
    return this.couponsService.create({
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAll() {
    return this.couponsService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.getById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      description?: string;
      discountType?: 'percentage' | 'fixed';
      discountValue?: number;
      maxUses?: number;
      expiresAt?: string;
      active?: boolean;
      productIds?: number[];
    }
  ) {
    return this.couponsService.update(id, {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.delete(id);
  }

  @Post('validate/:code')
  async validate(@Param('code') code: string) {
    return this.couponsService.validate(code);
  }

  @Post('calculate-discount')
  async calculateDiscount(
    @Body() data: { couponCode: string; productId?: number | null; amount: number }
  ) {
    return this.couponsService.calculateDiscount(
      data.couponCode,
      data.productId ?? null,
      data.amount
    );
  }
}

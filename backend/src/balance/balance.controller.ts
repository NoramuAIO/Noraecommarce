import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('balance')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get('packages')
  async findAllPackages() {
    return this.balanceService.findAllPackages();
  }

  @Post('packages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createPackage(@Body() data: { amount: number; bonus: number; price: number; popular?: boolean }) {
    return this.balanceService.createPackage(data);
  }

  @Put('packages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePackage(@Param('id') id: string, @Body() data: any) {
    return this.balanceService.updatePackage(+id, data);
  }

  @Delete('packages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deletePackage(@Param('id') id: string) {
    return this.balanceService.deletePackage(+id);
  }
}

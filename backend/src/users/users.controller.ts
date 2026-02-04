import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(+id);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(+id, data);
  }

  @Put(':id/balance')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateBalance(
    @Param('id') id: string, 
    @Body() data: { newBalance: number; type: string; isRevenue: boolean; note?: string },
    @Request() req: any
  ) {
    return this.usersService.updateBalanceWithTransaction(
      +id, 
      data.newBalance, 
      data.type, 
      data.isRevenue,
      req.user?.id,
      data.note
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}

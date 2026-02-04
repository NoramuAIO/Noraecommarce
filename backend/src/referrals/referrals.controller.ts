import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ReferralsService } from './referrals.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AdminGuard } from '../auth/admin.guard'

@Controller('referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addReferral(@Request() req: any, @Body() data: any) {
    return this.referralsService.addReferral(req.user.id, data.referredId, {
      name: req.user.name,
      email: req.user.email,
      image: req.user.avatar,
      website: data.website,
      discord: data.discord,
    })
  }

  @Get('for-user/:userId')
  async getReferralsForUser(@Param('userId') userId: string) {
    return this.referralsService.getReferralsForUser(parseInt(userId))
  }

  @Get('given-by-user/:userId')
  @UseGuards(JwtAuthGuard)
  async getReferralsGivenByUser(@Param('userId') userId: string, @Request() req: any) {
    // Sadece kendi referrallarını veya admin görebilir
    if (parseInt(userId) !== req.user.id && req.user.role !== 'admin') {
      return []
    }
    return this.referralsService.getReferralsGivenByUser(parseInt(userId))
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllReferrals() {
    return this.referralsService.getAllReferrals()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getReferral(@Param('id') id: string) {
    return this.referralsService.getAllReferrals().then(refs => 
      refs.find(r => r.id === parseInt(id))
    )
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateReferral(@Param('id') id: string, @Body() data: any) {
    return this.referralsService.updateReferral(parseInt(id), data)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteReferral(@Param('id') id: string) {
    return this.referralsService.deleteReferral(parseInt(id))
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async approveReferral(@Param('id') id: string) {
    return this.referralsService.approveReferral(parseInt(id))
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async rejectReferral(@Param('id') id: string) {
    return this.referralsService.rejectReferral(parseInt(id))
  }

  @Post('generate-link')
  @UseGuards(JwtAuthGuard)
  async generateReferralLink(@Request() req: any) {
    const link = this.referralsService.generateReferralLink(req.user.id)
    return { link }
  }

  @Post('apply-link')
  @UseGuards(JwtAuthGuard)
  async applyReferralLink(@Request() req: any, @Body() data: { link: string }) {
    return this.referralsService.validateAndApplyReferralLink(data.link, req.user.id)
  }
}

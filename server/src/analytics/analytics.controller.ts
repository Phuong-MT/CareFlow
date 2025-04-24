import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';


@Controller('analytics')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('super_admin', 'admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('event-queues')
  async getQueueStatsPerEvent() {
    return this.analyticsService.countQueuesPerEvent();
  }

  @Post('daily-queues')
  async getQueueStatsPerDay(@Body()numDays: string = '30d') {
    return this.analyticsService.countQueuesPerDay(numDays);
  }
}
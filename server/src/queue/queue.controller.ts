import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto'
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';
@Controller('queues')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('joinQueue')
  joinQueue(@Request() req : any, @Body() createQueueDto: CreateQueueDto) {
    return this.queueService.joinQueue(req.user.id, createQueueDto);
  }

  @Get('list')
  @Roles('admin', 'super_admin')
  listQueue(@Query('locationId') locationId: number, @Query('tenantCode') tenantCode: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.queueService.listQueue(locationId, tenantCode, page, limit);
  }

  @Put('updateCurrent')
  @Roles('admin', 'super_admin')
  updateCurrent(@Request() req : any,@Body() updateQueueDto: UpdateQueueDto) {
    return this.queueService.updateCurrent(req.user.id,updateQueueDto);
  }

  @Delete('leaveQueue/:id')
  @Roles('user', 'admin')
  leaveQueue(@Param('id') id: number) {
    return this.queueService.leaveQueue(id);
  }

  @Delete('resetDailyQueue')
  @Roles('super_admin')
  resetDailyQueue() {
    return this.queueService.resetDailyQueue();
  }
}

import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard,RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('createEvent')
  @Roles('super_admin', 'admin')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Get('findAllEvent')
  @Roles('super_admin', 'admin')
  findAllEvent(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.eventService.findAllEvent(page, limit);
  }

  @Get('findAllEventUserCanSee')
  findAllEventUserCanSee(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.eventService.findAllEventUserCanSee(page, limit);
  }

  @Get('findOneEvent/:id')
  @Roles('super_admin', 'admin')
  findOneEvent(@Param('id') id: string) {
    return this.eventService.findOneEvent(+id);
  }

  @Put('updateEvent/:id')
  @Roles('super_admin', 'admin')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.updateEvent(+id, updateEventDto);
  }

  @Delete('removeEvent/:id')
  @Roles('super_admin', 'admin')
  removeEvent(@Param('id') id: string) {
    return this.eventService.removeEvent(+id);
  }
}
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request, UseInterceptors, ParseFilePipeBuilder, UploadedFile, HttpStatus } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('events')
@UseGuards(JwtAuthGuard,RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('createEvent')
  @Roles('super_admin', 'admin')
  @UseInterceptors(FileInterceptor('floorPlanImage', {
      storage: diskStorage({
        destination: './uploads/floorplans',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),)
  createEvent(@Body() createEventDto: CreateEventDto,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) 
          .addFileTypeValidator({ fileType: 'image/*' })    
          .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          }),
      ) image: Express.Multer.File) {
    return this.eventService.createEvent(createEventDto, image);
  }

  @Get('findAllEvent')
  @Roles('super_admin', 'admin')
  findAllEvent(@Request() req: any,@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    console.log(req.user);
    return this.eventService.findAllEvent(req.user.id, +page, +limit);
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
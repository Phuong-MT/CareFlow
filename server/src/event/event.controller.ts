import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request, UseInterceptors, ParseFilePipeBuilder, UploadedFile, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
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
  findOneEvent(@Param('id') id: string,
    @Request() req: any
) {
    return this.eventService.findOneEvent(+id, req.user.id);
  }

  @Put('updateEvent/:id')
  @Roles('super_admin', 'admin')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.updateEvent(+id, updateEventDto);
  }

  @Get(':roomId')
  CheckQrCode(
    @Param('roomId') roomId: string,
    @Query('tg') tg: string,
    @Res() res: Response,
  ) {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000;

    const timestamp = Number(tg);
    if (!tg || isNaN(timestamp) || now - timestamp > maxAge) {
      return res.redirect('http://localhost:3000/qr-expired');
    }
    const frontendUrl = `http://localhost:3000/poc/events/${roomId}/live`;
    return res.redirect(302, frontendUrl);
  }
}
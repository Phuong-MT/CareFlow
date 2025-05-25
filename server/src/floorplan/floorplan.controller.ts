import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
  ParseFilePipeBuilder,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FloorplanService } from './floorplan.service';
import { FloorPlanDto } from './dto/create-floorplan.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('floor-plan')
export class FloorplanController {
  constructor(private readonly floorPlanService: FloorplanService) {}

  @Post(':eventCode/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Param('eventCode') eventCode: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) 
        .addFileTypeValidator({ fileType: 'image/*' })    
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.floorPlanService.uploadFloorPlan(eventCode, image);
  }

  @Post('save')
   async saveFloorPlan(@Body() floorPlanDto: FloorPlanDto) {
    return this.floorPlanService.saveFloorPlan(floorPlanDto);
  }

  @Get(':eventCode')
  getFloorPlanWithLocations(@Param('eventCode') eventCode: string) {
    return this.floorPlanService.getWithLocations(eventCode);
  }
}

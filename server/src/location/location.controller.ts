import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto} from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { RoleEnum } from 'src/common/commonEnum';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  
  @Post('/create')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  create(@Body() createLocationDto: CreateLocationDto,
          @Request() req: any
) {
    return this.locationService.create(createLocationDto,req.user.id);
  }

  @Get('/findAll')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  findAll(@Request()  req : any) {
    return this.locationService.findAll(req.user.id);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Put(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }
}
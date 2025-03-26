// tenant.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { Roles } from 'src/common/roles.decorator';
import { RoleEnum } from 'src/common/commonEnum';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async create(@Body() createTenantDto: CreateTenantDto) {
    return await this.tenantService.create(createTenantDto);
  }

  @Get('/findAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async findAll(@Request() req: any) {
    return await this.tenantService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const tenantCode = id
    return await this.tenantService.findOne(tenantCode);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    const tenantCode = id;
    return await this.tenantService.update(tenantCode, updateTenantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const tenantCode  = id
    return await this.tenantService.remove(tenantCode);
  }
}

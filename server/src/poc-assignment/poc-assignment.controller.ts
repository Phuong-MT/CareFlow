import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, BadRequestException } from '@nestjs/common';
import { PocAssignmentService } from './poc-assignment.service';
import { Roles } from 'src/common/roles.decorator';
import { RoleEnum } from 'src/common/commonEnum';
import { JwtAuthGuard } from 'src/users/passport/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { AnyMxRecord } from 'dns';

@Controller('poc-assignment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PocAssignmentController {
  constructor(private readonly pocAssignmentService: PocAssignmentService) {
  }
  @Roles(RoleEnum.POC, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @Get('userId')
  async getAssignments(@Request() req:any) {
    return await this.pocAssignmentService.getAssignmentsByUser(req.user.id);
  }
  
  // phan cong
  @Roles(RoleEnum.POC, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @Post()
  async create(){
    
  }
  
 @Roles(RoleEnum.POC, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @Patch('poc/active')
  async updatePocAssignment(@Request() req: any, @Body() body:{
    eventId: number,
    locationId: number,
    isActive: boolean
  }) {
    return await this.pocAssignmentService.updatePocAssignment(req.user.id,body);
  }
 @Roles(RoleEnum.POC, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @Get('pocUser')
  async getAllPoc(@Request() req: any) {
    try{
      const pocUser = await this.pocAssignmentService.getAllPoc(req.user.id);
      return pocUser
    }catch(err){
      throw new BadRequestException;
    }
  }
}

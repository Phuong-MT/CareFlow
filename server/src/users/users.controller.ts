import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request, UseFilters, HttpException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto, CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiUnauthorizedResponse} from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { ERROR_TYPE, transformError } from 'src/common/config.errors';
import { JwtRefreshGuard } from './passport/refresh-jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { RoleEnum } from 'src/common/commonEnum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // register function.
  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error' }) 
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
    //  console.log('createUserDto: ', createUserDto);
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  // login function.
  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 201, description: 'User successfully logged in' })
  @ApiUnauthorizedResponse({status: 401,
    description: 'Unauthorized',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any) {
    try {
      return await this.usersService.login(req.user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  //function update user info 
  @Patch('/update')
  @ApiOperation({ summary: '' })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({status: 200, description:'User successfully update info'})
  @ApiResponse({ status: 400, description: 'Validation error' })
  async update(@Request() req:any,@Body(new ValidationPipe()) updateUserDto: UpdateUserDto){
    try {
      if(!req.user.id){
        throw new BadRequestException(
                transformError(
                  'User',''
                ),
              );
      }
      return this.usersService.update(req.user.id, updateUserDto)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get profile a user' })
  @Get('/profile')
  @ApiResponse({status: 200, description:'Get profile a user'})
  @ApiResponse({ status: 401, description: 'Validation error' })
  async getProfile(@Request() req) { 
    try {
      return await this.usersService.findId(req.user.id);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  // refresh token 
  @Get('/refresh-token')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'refresh-token' })
  @ApiResponse({ status: 200,
    example:{
        access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZmMDZkZjRhLWMyZWUtNGJmMy04ODJlLTlhMGY2ZmFkZjI4ZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDIyNzcxMzIsImV4cCI6MTc0MjI3NzE5Mn0.dAmk3rz4FF0z_SYx6vCZlL_1X7AEqDiHcJdtR8R8R3A'
    }
  })
  @ApiResponse({ status: 419, description:'Refresh toke Expired'})
  async refreshToken(@Request() req) {
    try {
      return await this.usersService.refreshToken(req.user);
    } catch (error) {
      throw new BadRequestException('Session Expired');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() req: any){
      try {
        return this.usersService.logout(req.user.id, req.user.jit);
      } catch (error) {
        throw new  BadRequestException()
      }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  @Post('/create/admin')
  async accountAdmin(@Request() req : any,@Body() createAdminDto: CreateAdminDto ){
    return await this.usersService.accountAdmin(createAdminDto, req.user.email);
  }

}

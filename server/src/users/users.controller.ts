import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request, UseFilters, HttpException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiUnauthorizedResponse} from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { ERROR_TYPE, transformError } from 'src/common/config.errors';
import { JwtRefreshGuard } from './passport/refresh-jwt-auth.guard';

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
  @Get('/profile')
  async getProfile(@Request() req) { 
    try {
      return await this.usersService.findId(req.user.id);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  // refresh token 
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh-token')
  @ApiResponse({ status: 200,
    example:{
        access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZmMDZkZjRhLWMyZWUtNGJmMy04ODJlLTlhMGY2ZmFkZjI4ZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDIyNzcxMzIsImV4cCI6MTc0MjI3NzE5Mn0.dAmk3rz4FF0z_SYx6vCZlL_1X7AEqDiHcJdtR8R8R3A'
    }
  })
  @ApiResponse({ status: 419})
  async refreshToken(@Request() req) {
    try {
      return await this.usersService.refreshToken(req.user);
    } catch (error) {
      throw new BadRequestException('Session Expired');
    }
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, loginUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { userInfo } from 'os';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/hello')
  getHello(): string {
    return this.usersService.getHello();
  }
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
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async login(@Body(new ValidationPipe()) userInfo: loginUser) {
    try {
      return await this.usersService.login(userInfo);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

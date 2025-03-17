import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiUnauthorizedResponse} from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { ERROR_TYPE, transformError } from 'src/common/config.errors';

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
}

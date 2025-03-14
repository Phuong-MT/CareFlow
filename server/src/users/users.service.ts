import {BadRequestException,Injectable,UnauthorizedException} from '@nestjs/common';
import { CreateUserDto, loginUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { transformError, ERROR_TYPE } from '../common/config.errors';
import { hashPassword, comparePassword} from '../utils/helper';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User,
              private jwtService: JwtService          
) {}
  getHello(): string {
    return 'hello';
  }
// register function.
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const user = await this.userModel.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException(
        transformError(
          `${email}`, 
          ERROR_TYPE.EXIST,
        ),
      );
    }
    const hashedPassword = await hashPassword(password);
    const response = await this.userModel.create({ name, email, password: hashedPassword, id: v4()});
    const token = this.jwtService.sign({id : response.id, email : response.email})
    return {access_token : token}
  }
  // login function.
  async login(userInfo: loginUser){
    const { email, password } = userInfo;
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException(
        transformError(
          `${email}`, 
          ERROR_TYPE.EXIST,
        ),
      );
    }
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException(
        transformError(
          'Password', 
          ERROR_TYPE.IN_VALID,
        ),
      );
    }

    const token =this.jwtService.sign({id : user.id, email : user.email})
    return {access_token : token}
  }
  //function update user info
  async update(updateUserDto: UpdateUserDto) {
      const user = await this.userModel.findOne({
        where: {
          id: updateUserDto.id
        }
      });
      if (!user) {
        throw new BadRequestException(
          transformError(
            'id', 
            ERROR_TYPE.NOT_FOUND,
          ),
        );
      }
      await this.userModel.update(
        { ...updateUserDto },
        { where: { id: updateUserDto.id } }
      );
      return 'user successfully update info';
  }
}

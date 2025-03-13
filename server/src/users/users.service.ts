import {BadRequestException,Injectable,} from '@nestjs/common';
import { CreateUserDto, loginUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { transformError, ERROR_TYPE } from '../common/config.errors';
import { hashPassword, comparePassword} from '../utils/helper';
import { identity } from 'rxjs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}
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
    console.log(hashedPassword)
    const response = await this.userModel.create({ name, email, password: hashedPassword});
    return {id: response.id, name: response.name};
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
    return {id: user.id, name: user.name};
  }
}

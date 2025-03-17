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
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({where: {email}});
    if(!user){
      return null;
    }
    const isPasswordMatch = await comparePassword(password, user.password);
    if(!isPasswordMatch){
      return null;
    }
    return user;
  }
  // login function.
  async login(user: any){
    return {
     access_token : this.jwtService.sign({id: user.id, email: user.email})
    };
  }
  //function update user info
  async update(id:any, updateUserDto: UpdateUserDto) {
    const response = this.userModel.findOne({where: {id}})
      if (!response) {
        throw new BadRequestException(
          transformError(
            'id', 
            ERROR_TYPE.NOT_FOUND,
          ),
        );
      }
      await this.userModel.update(
        { ...updateUserDto },
        { where: { id} }
      );
      return 'user successfully update info';
  }
  async findId(id: any){
    const response = await this.userModel.findOne({
      where:{id},
      attributes:{
        exclude:['password','created_at']
      }
    });
    if(!response){
      throw new BadRequestException(
        transformError(
          'id', 
          ERROR_TYPE.NOT_FOUND,
        ),
      );
    }
    return response;
  }
}

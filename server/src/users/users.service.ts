import {BadRequestException,Injectable,UnauthorizedException} from '@nestjs/common';
import { CreateUserDto, loginUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { transformError, ERROR_TYPE } from '../common/config.errors';
import { hashPassword, comparePassword} from '../utils/helper';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Justit } from 'src/just-it/entities/just-it.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User,
              private jwtService: JwtService,
              private configService: ConfigService,
              @InjectModel(Justit) private jitModel: typeof Justit        
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
    const jit = v4();
    const token = this.jwtService.sign({id : response.id, email : response.email, jit})
    const refresh_token = this.jwtService.sign({id: response.id, email: response.email, jit},{
      secret: this.configService.get<string>('SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
  })
    return {access_token : token, refresh_token}
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
    const jit = v4();
    return {
      access_token : this.jwtService.sign({id: user.id, email: user.email, jit}),
      refresh_token : this.jwtService.sign({id: user.id, email: user.email, jit},{
      secret: this.configService.get<string>('SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
  })
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
  //refresh token 
  async refreshToken(user: any){
    const id = user.id;
    if(!id){
      throw new BadRequestException('id khong ton tai');
    }
    const userid  = this.userModel.findOne({
      where: {id},
      attributes:['id'],
    })
    if(!userid){
      throw new BadRequestException(
        transformError(
          'id', 
          ERROR_TYPE.NOT_FOUND,
        )
      )
    }
    const access_token = this.jwtService.sign({id: user.id, email : user.email});
    return {access_token}
  }
   //logout function
   async logout(id: string, jit: string){
    if(!id || !jit){
      throw new BadRequestException('id khong ton tai');
    }
    await this.jitModel.create({id, jit})
    return "Logged out successfully"
  }
}

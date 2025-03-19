import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Justit } from 'src/just-it/entities/just-it.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    protected configService: ConfigService,
    @InjectModel(Justit) private jitModel: typeof Justit
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: any) {
    const {jit} = payload;
        if(!jit){
          return null;
        }
        const isRevoked = await this.jitModel.count({
          where: { jit },
        });
    
        if (isRevoked > 0) {
          throw new HttpException('Token has been revoked', 419);
        }
    return {id: payload.id, email: payload.email, jit: payload.jit};
  }
}
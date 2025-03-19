import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Justit } from 'src/just-it/entities/just-it.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected configService: ConfigService,
    @InjectModel(Justit) private jitModel: typeof Justit
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'secretKey',
    });
  }

  async validate(payload: any) {
    const {jit} = payload;
    if(!jit){
      throw new UnauthorizedException('Invalid token structure');
    }
    const isRevoked = await this.jitModel.count({
      where: { jit },
    });

    if (isRevoked > 0) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return {id: payload.id, email: payload.email, jit: payload.jit};
  }
}
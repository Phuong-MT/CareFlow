import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { JwtRefreshStrategy } from './passport/refresh-jwt-strategy';

@Module({
  imports: [SequelizeModule.forFeature([User]),
  PassportModule.register({}),
  JwtModule.registerAsync({
    imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secretKey',
        signOptions: {
          expiresIn: '30s'
        },
        global: true,
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [LocalStrategy, UsersService, JwtStrategy, JwtRefreshStrategy],
})
export class UsersModule {}

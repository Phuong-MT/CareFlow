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
import { JustItModule } from 'src/just-it/just-it.module';
import { Justit } from 'src/just-it/entities/just-it.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Justit]),
  PassportModule.register({}),
  JwtModule.registerAsync({
    imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secretKey',
        signOptions: {
          expiresIn: '3600s'
        },
        global: true,
      }),
    }),
    JustItModule
  ],
  controllers: [UsersController],
  providers: [LocalStrategy, UsersService, JwtStrategy, JwtRefreshStrategy],
  exports:[SequelizeModule]
})
export class UsersModule {}

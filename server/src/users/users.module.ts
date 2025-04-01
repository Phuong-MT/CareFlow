import { forwardRef, Module } from '@nestjs/common';
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
import { TenantModule } from 'src/tenant/tenant.module';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { RolesGuard } from 'src/common/roles.guard';

@Module({
  imports: [SequelizeModule.forFeature([User, Justit, Tenant]),
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
    JustItModule,
    forwardRef(() => TenantModule)
  ],
  controllers: [UsersController],
  providers: [LocalStrategy, UsersService, JwtStrategy, JwtRefreshStrategy, RolesGuard],
  exports:[SequelizeModule, JwtStrategy, UsersService, JwtModule]
})
export class UsersModule {}

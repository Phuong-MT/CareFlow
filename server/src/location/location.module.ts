import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Location } from './entities/location.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { RolesGuard } from 'src/common/roles.guard';
import { UsersModule } from 'src/users/users.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { JwtStrategy } from 'src/users/passport/jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Location, Tenant]),
      UsersModule,
      TenantModule
    ],
  controllers: [LocationController],
  providers: [LocationService,RolesGuard,JwtStrategy],
  exports: [SequelizeModule,LocationService, LocationModule],
})
export class LocationModule {}
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { JwtStrategy } from 'src/users/passport/jwt.strategy';
import { RolesGuard } from 'src/common/roles.guard';
import { UsersModule } from 'src/users/users.module';
import {Tenant} from 'src/tenant/entities/tenant.entity';
import {Location} from 'src/location/entities/location.entity';
import { TenantModule } from 'src/tenant/tenant.module';
import { LocationModule } from 'src/location/location.module';
@Module({
  imports: [SequelizeModule.forFeature([Event, Tenant, Location]), UsersModule, TenantModule, LocationModule],
  controllers: [EventController],
  providers: [EventService, JwtStrategy, RolesGuard],
  exports: [EventService],
})
export class EventModule {}
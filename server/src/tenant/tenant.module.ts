import { forwardRef, Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tenant } from './entities/tenant.entity';
import { RolesGuard } from 'src/common/roles.guard';
import { JwtStrategy } from 'src/users/passport/jwt.strategy';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports:[SequelizeModule.forFeature([Tenant]), 
  forwardRef(() => UsersModule),
  ],
  controllers: [TenantController],
  providers: [TenantService, RolesGuard,JwtStrategy],
  exports:[SequelizeModule, TenantService, TenantModule]
})
export class TenantModule {}

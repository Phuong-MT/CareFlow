import { Module } from '@nestjs/common';
import { PocAssignmentService } from './poc-assignment.service';
import { PocAssignmentController } from './poc-assignment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PocAssignment } from './entities/poc-assignment.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from 'src/users/passport/jwt.strategy';
import { RolesGuard } from 'src/common/roles.guard';

@Module({
  imports: [SequelizeModule.forFeature([PocAssignment]), UsersModule],
  controllers: [PocAssignmentController],
  providers: [PocAssignmentService,JwtStrategy, RolesGuard],
  exports: [PocAssignmentService],
})
export class PocAssignmentModule {}

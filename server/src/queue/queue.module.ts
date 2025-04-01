import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Queue } from './entities/queue.entity';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { JwtStrategy } from 'src/users/passport/jwt.strategy';
import { RolesGuard } from 'src/common/roles.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Queue]), 
  UsersModule],
  controllers: [QueueController],
  providers: [QueueService, JwtStrategy,RolesGuard ],
  exports: [QueueService],
})
export class QueueModule {}

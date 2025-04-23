import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Queue } from 'src/queue/entities/queue.entity';
import { Event } from 'src/event/entities/event.entity';
import { JwtStrategy } from 'src/users/passport/jwt.strategy';
import { RolesGuard } from 'src/common/roles.guard';
import { EventModule } from 'src/event/event.module';
import { QueueModule } from 'src/queue/queue.module';
import { JustItModule } from 'src/just-it/just-it.module';
@Module({
  imports: [SequelizeModule.forFeature([Event, Queue]), EventModule,QueueModule, JustItModule],
  providers: [AnalyticsService, JwtStrategy, RolesGuard],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}

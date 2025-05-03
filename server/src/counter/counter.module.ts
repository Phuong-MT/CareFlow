import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';
import { QueueModule } from 'src/queue/queue.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Counter } from './entities/counter.entity';
@Module({
  imports: [SequelizeModule.forFeature([Counter]), QueueModule],
  controllers: [CounterController],
  providers: [CounterService],
  exports: [CounterService],
})
export class CounterModule {}

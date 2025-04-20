import { Module } from '@nestjs/common';
import { QueueModule } from 'src/queue/queue.module';
import { QueueService } from 'src/queue/queue.service';


@Module({
  imports: [QueueModule],
  providers: [QueueService],
})
export class SocketModule {}
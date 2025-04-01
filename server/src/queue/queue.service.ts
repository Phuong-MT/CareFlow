import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Queue } from './entities/queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto'

@Injectable()
export class QueueService {
  constructor(@InjectModel(Queue) private queueModel: typeof Queue) {}

  async joinQueue( id: string,createQueueDto: CreateQueueDto): Promise<Queue> {
    const {tenantCode, locationId, eventId}  = createQueueDto;
    const count = await this.queueModel.count({
      where: { locationId, tenantCode, queueDate: new Date() },
    });
    const newQueue = await this.queueModel.create({
      ...createQueueDto,
      position: count + 1,
      queueDate: new Date(),
      userId: id, 
      eventId
    });
    return newQueue;
  }

  async listQueue(locationId: number, tenantCode: string, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const { rows: queues, count: total } = await this.queueModel.findAndCountAll({
      where: { locationId, tenantCode },
      offset,
      limit,
      order: [['position', 'ASC']],
    });
    return { queues, total, page, limit };
  }

  async updateCurrent(id: string, updateQueueDto: UpdateQueueDto): Promise<[number]> {
    return this.queueModel.update(updateQueueDto, { where: { id} });
  }

  async leaveQueue(id: number): Promise<void> {
    const queue = await this.queueModel.findByPk(id);
    if (queue) await queue.destroy();
  }

  async resetDailyQueue(): Promise<void> {
    await this.queueModel.destroy({ where: {} });
  }
}

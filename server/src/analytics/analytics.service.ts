import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Event } from '../event/entities/event.entity';
import { Queue } from '../queue/entities/queue.entity';
import { QueueEnum } from 'src/common/commonEnum';
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Event) private eventModel: typeof Event,
    @InjectModel(Queue) private queueModel: typeof Queue,
    private sequelize: Sequelize,
  ) {}

  async countQueuesPerEvent() {
    const events = await this.eventModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: Queue,
          attributes: [],
        },
      ],
      group: ['Event.id'],
      raw: true,
    });
  
    const eventStats = await Promise.all(
      events.map(async (event) => {
        const [pending, serving, success] = await Promise.all([
          Queue.count({ where: { eventId: event.id, status: QueueEnum.PENDING } }),
          Queue.count({ where: { eventId: event.id, status: QueueEnum.SERVING } }),
          Queue.count({ where: { eventId: event.id, status: QueueEnum.SUCCESS } }),
        ]);
  
        return {
          eventId: event.id,
          eventName: event.title,
          pending,
          serving,
          success,
        };
      })
    );
  
    return eventStats;
  }
  async countQueuesPerDay() {
    const result = await this.queueModel.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('queueDate')), 'date'], 
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'queueCount'],
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('queueDate'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('queueDate')), 'DESC']],
    });
  
    return result;
  }
}


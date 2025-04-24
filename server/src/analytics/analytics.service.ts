import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Event } from '../event/entities/event.entity';
import { Queue } from '../queue/entities/queue.entity';
import { QueueEnum } from 'src/common/commonEnum';
import { Op } from 'sequelize';
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
  async countQueuesPerDay(numDays: string) {
    let days = 30; 

    if (typeof numDays === 'string' && numDays.endsWith('d')) {
      days = parseInt(numDays.replace('d', ''), 10);
    }
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    const result = await this.queueModel.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('queueDate')), 'date'], 
        [
          Sequelize.literal(`COUNT(CASE WHEN status = '${QueueEnum.PENDING}' THEN 1 END)`),
          'pending',
        ],
        [
          Sequelize.literal(`COUNT(CASE WHEN status = '${QueueEnum.SERVING}' THEN 1 END)`),
          'serving',
        ],
        [
          Sequelize.literal(`COUNT(CASE WHEN status = '${QueueEnum.SUCCESS}' THEN 1 END)`),
          'success',
        ],
      ],
      where: {
        queueDate: {
          [Op.gte]: startDate,
        },
      },
      group: [Sequelize.fn('DATE', Sequelize.col('queueDate'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('queueDate')), 'DESC']],
    });
  
    return result;
  }
}


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Queue } from './entities/queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto'
import { QueueEnum } from 'src/common/commonEnum';
@Injectable()
export class QueueService {
  constructor(@InjectModel(Queue) private queueModel: typeof Queue) {}

  async joinQueue( id: string,createQueueDto: CreateQueueDto): Promise<Queue> {
    const {tenantCode, locationId, eventId, name}  = createQueueDto;
    const count = await this.queueModel.count({
      where: { locationId, tenantCode, queueDate: new Date() },
    });
    console.log(createQueueDto)
    const newQueue = await this.queueModel.create({
      nameUser: name,
      position: count + 1,
      queueDate: new Date(),
      userId: id, 
      eventId,
      locationId,
      tenantCode
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

  async findOneUser(payload:{userId: string, eventId: string, locationId: string, tenantCode: string}): Promise<Queue>{
    return this.queueModel.findOne({
      where:{
        userId: payload.userId,
        locationId: +payload.locationId,
        eventId: +payload.eventId,
        tenantCode: payload.tenantCode,
        queueDate: new Date()
      }
    })
  }
  async getQueueState(payload:{eventId: string, locationId: string, tenantCode: string}):Promise<Queue[]>{
    const result =await this.queueModel.findAll({
      attributes: ['id','userId', 'nameUser', 'status', 'position', 'queueDate', 'pocLocationId'], 
      where:
      { tenantCode: payload.tenantCode, locationId: payload.locationId, eventId: payload.eventId, queueDate: new Date(), status: [QueueEnum.PENDING, QueueEnum.SERVING] },
    })
    return result
  }
  async findFirstWaiting(tenantCode: string, eventId: string, locationId: string): Promise<Queue | null> {
    return this.queueModel.findOne({
      where: {
        status: QueueEnum.PENDING,
        tenantCode,
        eventId,
        locationId
      },
      order: [['createdAt', 'ASC']],
    });
  }

  async updateStatus(queueId: number, pocLocationId: number,status: string) {
    return this.queueModel.update({ status, pocLocationId }, { where: { id: queueId } });
  }

  async getQueueByPoc(pocLocationId: number) {
    return this.queueModel.findAll({
      where: { pocLocationId },
      order: [['createdAt', 'ASC']],
    });
  }
}

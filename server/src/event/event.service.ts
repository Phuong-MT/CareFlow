import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { CreateEventDto} from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Location } from '../location/entities/location.entity';
import { UsersService } from 'src/users/users.service';
import { off } from 'process';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event) private eventModel: typeof Event,
 private readonly usersService: UsersService, ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const {title, locationId, dateStart,dateEnd, tenantCode} = createEventDto
    return this.eventModel.create({title, locationId, dateStart, dateEnd,  tenantCode});
  }

  async findAllEvent(userId: string ,page: number = 1, limit: number = 10): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const user = await this.usersService.findId(userId);
    if (!user) throw new NotFoundException('User not found');
    const tenantCode = user.tenantCode;
    const { rows: events, count: total } = await this.eventModel.findAndCountAll({ offset, limit,
      where:{
        tenantCode
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Tenant,
          attributes: ['name', 'tenantCode'],
        },
        {
          model: Location,
          attributes: ['id', 'name', 'address'],
        }
      ],
     });
    return { events, total, page, limit };
  }

  async findAllEventUserCanSee(page: number = 1, limit: number = 10): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const { rows: events, count: total } = await this.eventModel.findAndCountAll({ offset, limit });
    return { events, total, page, limit };
  }

  async findOneEvent(id: number): Promise<Event> {
    const event = await this.eventModel.findByPk(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto): Promise<[number]> {
    return this.eventModel.update(updateEventDto, { where: { id } });
  }

  async removeEvent(id: number): Promise<void> {
    const event = await this.findOneEvent(id);
    await event.destroy();
  }
}

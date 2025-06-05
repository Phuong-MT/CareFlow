import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { CreateEventDto} from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Location } from '../location/entities/location.entity';
import { UsersService } from 'src/users/users.service';
import {FloorPlan} from 'src/floorplan/entities/floorplan.entity'
import { FloorplanService } from 'src/floorplan/floorplan.service';
import { PocLocation } from 'src/poc-assignment/entities/poc-location.entity';
import { Op } from 'sequelize';
@Injectable()
export class EventService {
  constructor(@InjectModel(Event) private eventModel: typeof Event,
  private readonly floorPlanService: FloorplanService,
  private readonly usersService: UsersService,
) {}

  async createEvent(createEventDto: CreateEventDto, image: Express.Multer.File): Promise<Event> {
    const {title, locationId, dateStart,dateEnd, tenantCode, description} = createEventDto
    console.log(image);
    const event = await this.eventModel.create({title, locationId, description, dateStart, dateEnd,  tenantCode});
    const floorplan  = await this.floorPlanService.createFloorPlan(event.id, image,event.title)
    if(!floorplan || !event) {
      throw new BadRequestException('create event failed');
    }
    return event;
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
        },
        {
          model: FloorPlan,
          attributes: ['id', 'name', 'floorPlanImageUrl'],
          include: [{ model: PocLocation, attributes: ['id', 'name', 'x', 'y','floorPlanId'] }],
        }
      ],
     });
    return { events, total, page, limit };
  }

  async findAllEventUserCanSee(userId: string,page: number = 1, limit: number = 10): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const user = await this.usersService.findId(userId);
    if (!user) throw new NotFoundException('User not found');
    const tenantCode = user.tenantCode;
    const date = new Date();
    const { rows: events, count: total } = await this.eventModel.findAndCountAll({ offset, limit,
      where:{
        tenantCode,
        dateStart: {
          [Op.lte]: date
        },
        dateEnd: {
          [Op.gte]: date
        }
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
        },
        {
          model: FloorPlan,
          attributes: ['id', 'name', 'floorPlanImageUrl'],
          include: [{ model: PocLocation, attributes: ['id', 'name', 'x', 'y','floorPlanId'] }],
        }
      ],
     });
    return { events, total, page, limit };
  }

  async findOneEvent(id: number, userId: string): Promise<Event> {
      const user = await this.usersService.findId(userId);
      if(!user){
         throw new NotFoundException('UserId not found');
      }
      const event = await this.eventModel.findOne({
        where:{id, tenantCode: user.tenantCode},
          include: [{
            model: FloorPlan,
            include: [{model: PocLocation}],
          }]
        });

    if (!event) {
      throw new NotFoundException('Event not found');
      }

    return event;
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto): Promise<[number]> {
    return this.eventModel.update(updateEventDto, { where: { id } });
  }

  // async removeEvent(id: number): Promise<void> {
  //   const event = await this.findOneEvent(id);
  //   await event.destroy();
  // }
}

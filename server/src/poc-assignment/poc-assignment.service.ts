import { Injectable } from '@nestjs/common';
import { CreatePocAssignmentDto } from './dto/create-poc-assignment.dto';
import { UpdatePocAssignmentDto } from './dto/update-poc-assignment.dto';
import { PocAssignment } from './entities/poc-assignment.entity';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/users.service';
import { PocLocation } from './entities/poc-location.entity';
import { Event } from 'src/event/entities/event.entity';
import { FloorPlan } from 'src/floorplan/entities/floorplan.entity';
import { Location } from 'src/location/entities/location.entity';
@Injectable()
export class PocAssignmentService {
  constructor(
    @InjectModel(PocAssignment)
    private readonly pocAssignmentModel: typeof PocAssignment,
    @InjectModel(PocLocation)
    private pocLocationModel: typeof PocLocation,
    @InjectModel(Event)
    private eventModel: typeof Event,
    @InjectModel(FloorPlan)
    private floorPlanModel: typeof FloorPlan,
    @InjectModel(Location)
    private locationModel: typeof Location,
    private readonly userService: UsersService,
  ) {}

async getAssignmentsByUser(userId: string) {
  return await this.pocAssignmentModel.findAll({
    where: {
      userId,
      isActive: true,
    },
    include: [
      {
        model: this.pocLocationModel,
        as: 'pocLocation',
      },
      {
        model: this.eventModel,
        as: 'event',
        include: [
          {
            model: this.floorPlanModel,
            as: 'floorPlan',
            include: [
              {
                model: this.pocLocationModel,
                as: 'pocLocations',
              },
            ],
          },
        ],
      },
      {
        model: this.locationModel,
        as: 'location',
      },
    ],
  });
}

  async updatePocAssignment(userId: string,body: {
    eventId: number;
    locationId: number;
    isActive: boolean;
  }) {
    return await this.pocAssignmentModel.update(
      { isActive: body.isActive },
      {
        where: {
          userId,
          eventId: body.eventId,
          locationId: body.locationId,
        },
      },
    );
  }
  async getAllPoc(userId: string) {
    try{
      const pocUser = await this.userService.getAllPoc(userId);
      return pocUser;
    }catch(err){
      throw new Error(err);
    }
  }
  async assignPoc(
    userId: string,
    eventId: number,
    locationId: number,
    pocLocationId: number,
  ): Promise<PocAssignment> {
    const pocAssignment = await this.pocAssignmentModel.create({
      userId,
      eventId,
      locationId,
      pocLocationId,
      isActive: true,
    });
    return pocAssignment;
  }
}

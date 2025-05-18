import { Injectable } from '@nestjs/common';
import { CreatePocAssignmentDto } from './dto/create-poc-assignment.dto';
import { UpdatePocAssignmentDto } from './dto/update-poc-assignment.dto';
import { PocAssignment } from './entities/poc-assignment.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PocAssignmentService {
  constructor(
    @InjectModel(PocAssignment)
    private readonly pocAssignmentModel: typeof PocAssignment,
  ) {}

  async getAssignmentsByUser(userId: string) {
    return await this.pocAssignmentModel.findAll({
      where: { userId ,
        isActive: true
      },
      include: ['event', 'location'],
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

}

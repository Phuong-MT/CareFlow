import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FloorPlan } from 'src/floorplan/entities/floorplan.entity';
import { PocLocation } from 'src/poc-assignment/entities/poc-location.entity';
import { FloorPlanDto } from './dto/create-floorplan.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FloorplanService {
  constructor(
    @InjectModel(FloorPlan)
    private floorPlanModel: typeof FloorPlan,

    @InjectModel(PocLocation)
    private pocLocationModel: typeof PocLocation,
  ) {}
  
  async createFloorPlan(eventCode: string, image : Express.Multer.File,name: string) {
    if (!image) {
    throw new BadRequestException('Image file is required');
    }
    const floorPlanImageUrl = `/uploads/floorplans/${image.filename}`;

    const existingFloorPlan = await this.floorPlanModel.findOne({ where: { eventCode } });

    if (existingFloorPlan) {
      throw new InternalServerErrorException('Floor plan already exists for this event code');
    }

    const floorPlan = await this.floorPlanModel.create({
      name,
      eventCode,
      floorPlanImageUrl,
    });

    return floorPlan;
  }

  async uploadFloorPlan(eventCode: string, image: Express.Multer.File) {
    const floorPlanImageUrl = `/uploads/floorplans/${image.filename}`;

    let floorPlan = await this.floorPlanModel.findOne({ where: { eventCode } });

    if (floorPlan) {
      floorPlan.floorPlanImageUrl = floorPlanImageUrl;
      await floorPlan.save();
    } else {
      floorPlan = await this.floorPlanModel.create({
        eventCode,
        floorPlanImageUrl,
      });
    }

    return floorPlan;
  }

  async saveFloorPlan(floorPlanDto: FloorPlanDto) {
  const { eventCode, floorPlanImageUrl } = floorPlanDto;

  try {
    const existing = await this.floorPlanModel.findOne({
      where: { eventCode },
    });

    if (existing) {
      await this.floorPlanModel.destroy({ where: { eventCode } });
    }

    const newFloorPlan = await this.floorPlanModel.create({
      eventCode,
      floorPlanImageUrl,
    });

    return {
      message: 'Floor plan saved successfully',
      data: newFloorPlan,
    };
  } catch (error) {
    console.error('Error saving floor plan:', error);
    throw new InternalServerErrorException('Failed to save floor plan');
  }
}

  async getWithLocations(eventCode: string) {
    const floorPlan = await this.floorPlanModel.findOne({
      where: { eventCode },
      include: [
        {
          model: this.pocLocationModel,
          as: 'pocLocations',
        },
      ],
    });

    if (!floorPlan) {
      throw new NotFoundException(`FloorPlan with eventCode ${eventCode} not found`);
    }

    return floorPlan;
  }
}

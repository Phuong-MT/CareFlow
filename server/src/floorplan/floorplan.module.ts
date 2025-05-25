import { Module } from '@nestjs/common';
import { FloorplanService } from './floorplan.service';
import { FloorplanController } from './floorplan.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FloorPlan } from './entities/floorplan.entity';
import { UsersModule } from 'src/users/users.module';
import { PocLocation } from 'src/poc-assignment/entities/poc-location.entity';

@Module({
  imports:[SequelizeModule.forFeature([FloorPlan,PocLocation]),UsersModule],
  controllers: [FloorplanController],
  providers: [FloorplanService],
  exports:[FloorplanService],
})
export class FloorplanModule {}

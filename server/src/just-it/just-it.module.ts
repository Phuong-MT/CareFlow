import { Module } from '@nestjs/common';
import { JustItService } from './just-it.service';
import { JustItController } from './just-it.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Justit } from './entities/just-it.entity';

@Module({
  imports: [SequelizeModule.forFeature([Justit])],
  controllers: [JustItController],
  providers: [JustItService],
  exports:[SequelizeModule]
})
export class JustItModule {}

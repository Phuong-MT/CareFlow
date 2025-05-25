import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Event } from 'src/event/entities/event.entity';
import { PocLocation } from 'src/poc-assignment/entities/poc-location.entity';

@Table({ tableName: 'floorplans' })
export class FloorPlan extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  floorPlanImageUrl: string;

  @ForeignKey(() => Event)
  @Column({ type: DataType.INTEGER, allowNull: false })
  eventCode: number;

  @BelongsTo(() => Event)
  event: Event;

  @HasMany(() => PocLocation)
  pocLocations: PocLocation[];
}

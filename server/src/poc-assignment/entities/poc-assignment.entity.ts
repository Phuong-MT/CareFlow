// src/poc-assignment/entities/poc-assignment.entity.ts
import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Location } from 'src/location/entities/location.entity';

@Table({ tableName: 'poc_assignments' })
export class PocAssignment extends Model {
  @ForeignKey(() => User)
  @Column
  userId: string

  @ForeignKey(() => Event)
  @Column
  eventId: number;

  @ForeignKey(() => Location)
  @Column
  locationId: number;

  @Column({ defaultValue: 'poc' })
  role: string;

  @Column({defaultValue: true})
  isActive: boolean;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Event)
  event: Event;

  @BelongsTo(() => Location)
  location: Location;
}

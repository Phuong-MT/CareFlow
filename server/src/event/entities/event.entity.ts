import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import {Location} from 'src/location/entities/location.entity'
import { Queue } from 'src/queue/entities/queue.entity';
@Table({ tableName: 'events' })
export class Event extends Model {
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.STRING, allowNull: false })
  tenantCode: string;

  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER, allowNull: false })
  locationId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.DATE, allowNull: false })
  dateStart: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  dateEnd: Date;
  
  @BelongsTo(() => Tenant)
  tenant: Tenant;

  @BelongsTo(() => Location)
  location: Location;
  @HasMany(() => Queue)
  queues: Queue[];
}

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Queue } from 'src/queue/entities/queue.entity';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { Event } from 'src/event/entities/event.entity';
@Table({ tableName: 'locations' })
export class Location extends Model {
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.INTEGER, allowNull: false })
  tenantId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsTo(() => Tenant)
  tenant: Tenant;

  @HasMany(() => Event)
  events: Event[];

  @HasMany(() => Queue)
  queues: Queue[];
}

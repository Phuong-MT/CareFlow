import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Tenant } from 'src/tenant/entities/tenant.entity'
import { Event } from 'src/event/entities/event.entity';
import { Queue } from 'src/queue/entities/queue.entity';

@Table({ tableName: 'counters' })
export class Counter extends Model {
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.STRING, allowNull: false })
  tenantCode: string;

  @ForeignKey(() => Event)
  @Column({ type: DataType.INTEGER, allowNull: false })
  eventId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  active: boolean;

  @BelongsTo(() => Tenant)
  tenant: Tenant;

  @BelongsTo(() => Event)
  event: Event;
  
  @HasMany(() => Queue)
    queues: Queue[];
}

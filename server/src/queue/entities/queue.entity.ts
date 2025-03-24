import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { User } from 'src/users/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';

@Table({ tableName: 'queues' })
export class Queue extends Model {
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.INTEGER, allowNull: false })
  tenantId: number;

  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER, allowNull: false })
  locationId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column({ type: DataType.ENUM('waiting', 'being_examined', 'done'), allowNull: false, defaultValue: 'waiting' })
  status: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  queueDate: Date;

  @BelongsTo(() => Tenant)
  tenant: Tenant;

  @BelongsTo(() => Location)
  location: Location;

  @BelongsTo(() => User)
  user: User;
}
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { User } from 'src/users/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import { QueueEnum } from 'src/common/commonEnum';

@Table({ tableName: 'queues' })
export class Queue extends Model {
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.STRING, allowNull: false })
  tenantCode: string;

  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER, allowNull: false })
  locationId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  userId: string;

  @Column({ type: DataType.ENUM(...Object.values(QueueEnum)), allowNull: false, defaultValue: QueueEnum.PENDING})
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
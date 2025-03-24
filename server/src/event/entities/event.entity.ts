import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import {Location} from 'src/location/entities/location.entity'
@Table({ tableName: 'events' })
export class Event extends Model {
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.INTEGER, allowNull: false })
  tenantId: number;

  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER, allowNull: false })
  locationId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @BelongsTo(() => Tenant)
  tenant: Tenant;

  @BelongsTo(() => Location)
  location: Location;
}

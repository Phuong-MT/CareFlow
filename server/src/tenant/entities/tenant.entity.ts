import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';


@Table({ tableName: 'tenants' })
export class Tenant extends Model {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  tenantCode: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => User)
  users: User[];
}
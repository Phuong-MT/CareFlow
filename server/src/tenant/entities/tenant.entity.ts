import { Table, Column, Model, DataType, HasMany, PrimaryKey} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';


@Table({ tableName: 'tenants' ,  timestamps: true})
export class Tenant extends Model {

  @Column({ type: DataType.STRING,  primaryKey: true, allowNull: false })
  tenantCode: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => User)
  users: User[];
}
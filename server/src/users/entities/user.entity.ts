import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { commonEnum, RoleEnum } from 'src/common/commonEnum';
import { Justit } from 'src/just-it/entities/just-it.entity';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@Table({ tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class User extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;
  
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.ENUM(...Object.values(commonEnum)), defaultValue: commonEnum.ACTIVE })
  status: commonEnum;
   
  @Column({type: DataType.STRING(), defaultValue: RoleEnum.USER})
  role: string;
  
  @Column({type: DataType.INTEGER, defaultValue: 0})
  resetpassword: number;// changer password 
  
  @ForeignKey(() => Tenant)
  @Column({ type: DataType.STRING, allowNull: false })
  tenantCode: string;

  @Column({ type: DataType.STRING})
  address: string;

  @BelongsTo(() => Tenant)
  tenant: Tenant;
  @Column({ type: DataType.STRING})
  phone: string;

  @HasMany(() => Justit)
  justit: [];
}
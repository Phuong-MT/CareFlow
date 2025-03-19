import { Table, Column, Model, DataType, ForeignKey, AllowNull } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
@Table({ tableName: 'justit', timestamps: true, createdAt: 'created_at', updatedAt: false })
export class Justit extends Model {
  @Column({ type: DataType.STRING, allowNull: false})
  @ForeignKey(() => User)
  id: string;

  @Column({ type: DataType.STRING,primaryKey: true, allowNull: false })
  jit: string
}
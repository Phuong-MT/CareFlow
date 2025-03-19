import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Justit } from 'src/just-it/entities/just-it.entity';

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

  @Column({ type: DataType.STRING})
  phone: string;

  @Column({ type: DataType.STRING})
  address: string;
  @HasMany(() => Justit) // Một User có nhiều JustIt
  justit: [];
}
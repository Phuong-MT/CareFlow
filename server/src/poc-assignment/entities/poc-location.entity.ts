// poc-location.model.ts
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { FloorPlan } from 'src/floorplan/entities/floorplan.entity'
@Table
export class PocLocation extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  x: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  y: number;

  @ForeignKey(() => FloorPlan)
  @Column({ type: DataType.INTEGER, allowNull: false })
  floorPlanId: number;

  @BelongsTo(() => FloorPlan)
  floorPlan: FloorPlan;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { TaskStatus } from "../../utils/types"
@Entity()
export class Task{

  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  title!: string

  @Column({
    type: "text",
    nullable: true,
  })
  description!: string

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.Pending,
  })
  status!: TaskStatus

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date
}
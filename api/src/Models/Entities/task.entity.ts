import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { TaskStatus } from "../../utils/types"

/*
  * Entidade Task representa uma tarefa no sistema.
  * Ela contém informações como título, descrição, status e data de criação.
  *
  * @class Task
  * @property {number} id - Identificador único da tarefa (gerado automaticamente).
  * @property {string} title - Título da tarefa (obrigatório, máximo 100 caracteres).
  * @property {string} description - Descrição da tarefa (opcional).
  * @property {TaskStatus} status - Status da tarefa (opcional, padrão é "Pending").
  * @property {Date} createdAt - Data de criação da tarefa (padrão é a data atual).
*/

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
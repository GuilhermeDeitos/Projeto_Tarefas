import { TaskStatus } from "../../utils/types";
import { IsString, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';

/*
  DTO (Data Transfer Object) para criar uma nova tarefa.
  Ele define a estrutura dos dados esperados para criar uma tarefa.
  @class CreateTaskDTO
  @property {string}
  title - Título da tarefa (obrigatório, mínimo 3 caracteres, máximo 100 caracteres).
  @property {string}
  description - Descrição da tarefa (opcional).
  @property {TaskStatus}
  status - Status da tarefa (obrigatório, deve ser um dos valores definidos em TaskStatus).

  @class UpdateTaskDTO
  Mesmas propriedades que CreateTaskDTO, mas todas são opcionais.
*/

export class CreateTaskDTO{  
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string = '';

  @IsOptional()
  description?: string;
  
  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.Pending;
}


export class UpdateTaskDTO{
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}


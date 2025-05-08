import { TaskStatus } from "../../utils/types";
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDTO{

  readonly id: Number = 0;
  
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly title: String = '';

  @IsOptional()
  readonly description?: String;
  readonly status: TaskStatus = TaskStatus.Pending;
  readonly createdAt: Date = new Date();
}

export class UpdateTaskDTO{
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  readonly title?: String;

  @IsOptional()
  readonly description?: String;

  @IsOptional()
  readonly status?: TaskStatus;
}


import { TaskStatus } from "../../utils/types";
import { IsString, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';

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


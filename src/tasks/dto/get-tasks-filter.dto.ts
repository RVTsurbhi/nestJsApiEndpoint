import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class TaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  search?: string;
}

import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumberString()
  status?: string;
}

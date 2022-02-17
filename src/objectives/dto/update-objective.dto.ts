import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateObjectiveDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: Date;
}

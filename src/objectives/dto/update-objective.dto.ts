import { IsString, IsOptional } from 'class-validator';

export class UpdateObjectiveDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

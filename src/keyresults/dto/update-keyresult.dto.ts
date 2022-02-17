import { IsString, IsOptional } from 'class-validator';

export class UpdateKeyResultDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

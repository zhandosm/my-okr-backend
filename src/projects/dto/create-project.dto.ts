import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;
}

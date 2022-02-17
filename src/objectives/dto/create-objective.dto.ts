import { IsString, IsDateString } from 'class-validator';

export class CreateObjectiveDto {
  @IsString()
  userId: string;

  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  deadline: Date;
}

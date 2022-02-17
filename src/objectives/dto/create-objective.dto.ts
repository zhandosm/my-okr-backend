import { IsString } from 'class-validator';

export class CreateObjectiveDto {
  @IsString()
  userId: string;

  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

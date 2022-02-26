import { IsString } from 'class-validator';

export class CreateKeyResultDto {
  @IsString()
  projectId: string;

  @IsString()
  objectiveId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

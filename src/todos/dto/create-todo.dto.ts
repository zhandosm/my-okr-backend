import { IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  projectId: string;

  @IsString()
  objectiveId: string;

  @IsString()
  keyResultId: string;

  @IsString()
  title: string;
}

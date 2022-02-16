import { IsBoolean } from 'class-validator';

export class PinProjectDto {
  @IsBoolean()
  isPinned: boolean;
}

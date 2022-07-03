import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { Project } from 'src/projects/models/project.model';
import { Objective } from 'src/objectives/models/objective.model';

export type KeyResultDocument = KeyResult & Document;

@Schema({ timestamps: true })
export class KeyResult {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Project.name })
  projectId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Objective.name })
  objectiveId: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const KeyResultSchema = SchemaFactory.createForClass(KeyResult);

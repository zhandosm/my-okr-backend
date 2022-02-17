import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { Project } from 'src/projects/models/project.model';

export type ObjectiveDocument = Objective & Document;

@Schema()
export class Objective {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: Project.name })
  projectId: Types.ObjectId;
  @Prop()
  title: string;
  @Prop()
  description: string;
}

export const ObjectiveSchema = SchemaFactory.createForClass(Objective);

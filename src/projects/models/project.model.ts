import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/models/user.model';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: Types.ObjectId;
  @Prop()
  title: string;
  @Prop({ default: false })
  isPinned: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

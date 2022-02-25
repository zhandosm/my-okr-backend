import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { Project } from 'src/projects/models/project.model';
import { Objective } from 'src/objectives/models/objective.model';
import { KeyResult } from 'src/keyresults/models/keyresult.model';

export type ToDoDocument = ToDo & Document;

@Schema()
export class ToDo {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Project.name })
  projectId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Objective.name })
  objectiveId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: KeyResult.name })
  keyResultId: Types.ObjectId;

  @Prop()
  title: string;

  @Prop({ default: 0 })
  status: number;
}

export const ToDoSchema = SchemaFactory.createForClass(ToDo);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id: Types.ObjectId;
  @Prop()
  email: string;
  @Prop()
  username: string;
  @Prop()
  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

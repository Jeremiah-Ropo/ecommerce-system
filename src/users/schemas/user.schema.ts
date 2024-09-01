import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true, 
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id; 
      delete ret._id;
      delete ret.password; 
    },
  },
})
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

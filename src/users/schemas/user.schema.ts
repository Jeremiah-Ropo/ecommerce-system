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

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({default: 'user', enum: ['user', 'admin']})
  role: string;

  @Prop({ default: false })
  banned: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

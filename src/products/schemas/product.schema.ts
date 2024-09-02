import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Product {
  @Prop({ required: true })
  SKU: string;

  @Prop({required: true})
  name: string;

  @Prop()
  description: string;

  @Prop({required: true})
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  isApproved: boolean;

  @Prop({ Ref: User})
  user: string;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

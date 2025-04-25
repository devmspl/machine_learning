import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import  slug from 'mongoose-slug-updater';
mongoose.plugin(slug);
@Schema()
export class Citymanagement {
  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop({ type: String, slug: "name" , unique: true ,slugOn: { save: true, update: false, updateOne: false, updateMany: false, findOneAndUpdate: false } })
  slug: string;

  @Prop()
  zipcode: string;

  @Prop()
  image_url: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: false })
  isPublish: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop(
    raw({
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: [
        {
          type: Number,
        },
      ],
      // address: { type: String, default: '' },
    }),
  )
  location: Record<string, any>;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}
export const CitymanagementSchema =
  SchemaFactory.createForClass(Citymanagement);

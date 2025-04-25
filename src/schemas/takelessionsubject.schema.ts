import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


@Schema()
export class Takelessionsubject {
  @Prop({ require: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  logo: string;

  @Prop()
  source: string;

  @Prop()
  url: string;

  @Prop()
  fromUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'takelessioncategory',
    required: false,
  })
  takelessioncategory: string;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: false })
  isProviderDone: boolean;

  @Prop()
  notes: string;

  @Prop()
  admin_notes: string;

  @Prop()
  wondrflyRefrence: string;

  @Prop({ default: true })
  isActivated: boolean;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const TakelessionsubjectSchema = SchemaFactory.createForClass(Takelessionsubject);

TakelessionsubjectSchema.index({ name: 1 });

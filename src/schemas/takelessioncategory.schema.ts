import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Takelessioncategory {
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
  notes: string;

  @Prop()
  admin_notes: string;

  @Prop({ default: true })
  isActivated: boolean;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const TakelessioncategorySchema = SchemaFactory.createForClass(Takelessioncategory);

TakelessioncategorySchema.index({ name: 1 });

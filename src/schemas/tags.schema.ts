import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Tags {
  @Prop({ require: true })
  name: string;

  @Prop()
  description: string;


  @Prop()
  image: string;

  @Prop()
  lessonKeyword: string;

  @Prop()
  logo: string;

  @Prop()
  icon: string;

  @Prop()
  pattern: string;

  @Prop()
  variant: string;

  @Prop()
  covers: string[];

  @Prop({ default: 0 })
  programCount: number;

  @Prop({ default: true })
  isActivated: boolean;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);

TagsSchema.index({ name: 1 });

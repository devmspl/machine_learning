import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Url {
  @Prop()
  urls: string[];

  @Prop()
  Fromurl: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'completed' | string;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

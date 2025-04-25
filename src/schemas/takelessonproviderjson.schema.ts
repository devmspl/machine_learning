import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Takelessonproviderjson {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'takelessionprovider', required: false })
  providerId: string;

  @Prop({ type: Object })  // or use `any` explicitly if needed
  providerJson: any;
}

export const TakelessonproviderjsonSchema = SchemaFactory.createForClass(Takelessonproviderjson);

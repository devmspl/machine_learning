import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Tasklessonreview {

  @Prop({ default: Date.now() })
  createdTime: Date;

  @Prop({ default: Date.now() })
  lastUpdatedTime: Date;

  @Prop({ default: '', type: String })
  body: string;

  @Prop({ default: '', type: String })
  locationType: string;

  @Prop({ default: '', type: Number })
  rating: number;

  @Prop({ default: '', type: String })
  userName: string;

  @Prop({ default: false, type: String })
  title: string;

  @Prop({ default: false, type: Boolean })
  isDeleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'takelessionprovider', required: false })
  providerId: string;
}

export const TasklessonreviewSchema = SchemaFactory.createForClass(Tasklessonreview);

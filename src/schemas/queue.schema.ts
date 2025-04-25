import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Queue {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'citymanagement',
    required: false,
  })
  cityId: string;

  // @Prop(
  //   raw([
  //     {
  //       url: String,
  //       status: String,
  //     },
  //   ]),
  // )
  // urls: Record<string, any>;

  @Prop()
  urls: string[];

  @Prop()
  urls_limit: number;

  @Prop({
    default: 'pending',
    Enum: ['pending', 'accepted', 'decline', 'processed'],
  })
  status: string;

  @Prop()
  admin_notes: string;

  @Prop()
  notes: string;

  @Prop({ default: false })
  addProvider: boolean;

  @Prop({ default: false })
  isCheckValid: boolean;

  @Prop({ default: 'manual', Enum: ['manual', 'chatgpt', 'gemini', 'google'] })
  type: string;

  @Prop({ default: false })
  is_child_care: boolean;

  @Prop({ default: false })
  is_event: boolean;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);

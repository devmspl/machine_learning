import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Event_source {

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'citymanagement',
    required: false,
  })
  cityId: string;
  
  @Prop()
  website: string;

  @Prop({ default: Date.now })
  last_cron: Date;

  @Prop({ default: false })
  change_detection: boolean;

  @Prop()
  status: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop()
  notes: string;

  @Prop()
  admin_notes: string;

  @Prop({ default: Date.now })
  createdOn: Date;

  @Prop({ default: Date.now })
  updatedOn: Date;
}

export const Event_sourceSchema = SchemaFactory.createForClass(Event_source);

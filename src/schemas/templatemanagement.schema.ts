import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Templatemanagement {
  @Prop({ default: 'open' })
  status: 'open' | 'completed' | 'in-review' | 'archived' | string;

  @Prop()
  challenges: string;

  @Prop()
  frquency: string;

  @Prop()
  ownership: string;

  @Prop()
  extractor_duration: string;

  @Prop()
  review_duration: string;

  @Prop()
  ai_prompts: string;

  @Prop()
  task_name: string;

  @Prop()
  task_description: string;

  @Prop()
  task_type: string;

  @Prop()
  cta: string;

  @Prop()
  review_comment: string;

  @Prop()
  extractor_comment: string;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const TemplatemanagementSchema = SchemaFactory.createForClass(Templatemanagement);

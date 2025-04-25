import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class TakelessonsubjectLessonsjson {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'takelessionsubject', required: false })
  subjectId: string;

  @Prop({ type: Object })  // or use `any` explicitly if needed
  lessonJson: any;
}

export const TakelessonsubjectLessonsjsonSchema = SchemaFactory.createForClass(TakelessonsubjectLessonsjson);

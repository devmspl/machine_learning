import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Allschoolteacherinfojson {

  @Prop({  })
  teacherId: String;

  @Prop({ })
  url: String;

  @Prop({ type: Object })
  teacherJson: any;
}

export const AllschoolteacherinfojsonSchema = SchemaFactory.createForClass(Allschoolteacherinfojson);

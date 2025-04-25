import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Schoolproviderreview {

  @Prop({  })
  teacherId: String;

  @Prop({ })
  url: String;

  @Prop({ type: Object })
  review: any;

  @Prop({  })
  provider: String;
}

export const SchoolproviderreviewSchema = SchemaFactory.createForClass(Schoolproviderreview);

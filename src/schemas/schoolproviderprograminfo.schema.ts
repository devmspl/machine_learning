import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Schoolproviderprograminfo {

  @Prop({  })
  teacherId: String;

  @Prop({ })
  url: String;

  @Prop({ type: Object })
  info: any;

  @Prop({  })
  provider: String;
}

export const SchoolproviderprograminfoSchema = SchemaFactory.createForClass(Schoolproviderprograminfo);

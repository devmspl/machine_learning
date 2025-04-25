import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Schoolproviderprogram {

  @Prop({  })
  teacherId: String;

  @Prop({ })
  url: String;

  @Prop({ type: Object })
  program: any;

  @Prop({  })
  provider: String;
}

export const SchoolproviderprogramSchema = SchemaFactory.createForClass(Schoolproviderprogram);

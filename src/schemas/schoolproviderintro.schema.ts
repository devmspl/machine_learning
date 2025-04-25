import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Schoolproviderintro {

  @Prop({  })
  teacherId: String;

  @Prop({ })
  url: String;

  @Prop({ type: Object })
  intro: any;

  @Prop({  })
  provider: String;

  @Prop({  })
  country: String;
}

export const SchoolproviderintroSchema = SchemaFactory.createForClass(Schoolproviderintro);

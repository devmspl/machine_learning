import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Website_structure {
  
  @Prop()
  website: string;

  @Prop()
  structure: string;

  @Prop({ default: Date.now })
  last_checked: Date;

  @Prop({ default: Date.now })
  createdOn: Date;

  @Prop({ default: Date.now })
  updatedOn: Date;
}

export const Website_structureSchema = SchemaFactory.createForClass(Website_structure);

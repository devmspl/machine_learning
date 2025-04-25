import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Temporaryprogram {
  @Prop({ default: { }, type: Object })
  programData: Record<string, any>;;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;

  @Prop({ default: '', type: String })
  url: string;

  @Prop({ default: false, type: Boolean })
  addProgram: boolean;

  @Prop()
  changeDetection: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'program', required: false })
  programId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  providerId: string;
}

export const TemporaryprogramSchema = SchemaFactory.createForClass(Temporaryprogram);

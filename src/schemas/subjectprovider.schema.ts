import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


@Schema()
export class Subjectprovider {
  @Prop({ require: true })
  description: string;

  @Prop()
  name: string;

  @Prop()
  tag_line: string;

  @Prop({type: Object})
  price: any;

  @Prop()
  profile_image: string;

  @Prop({type: Object})
  serviceProviderLocation: any;

  @Prop({type: Object})
  providedLocationTypes: any;

  @Prop()
  profile_link: string;

  @Prop()
  fromUrl: string;

  @Prop()
  serviceId: string;

  @Prop()
  rating: string;

  @Prop()
  reviewCount: string;

  @Prop()
  specialities: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'takelessionsubject',
    required: false,
  })
  subjectId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'takelessionprovider',
    required: false,
  })
  providerId: string;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop()
  notes: string;

  @Prop()
  admin_notes: string;

  @Prop({ default: true })
  isActivated: boolean;

  @Prop({ type: Object })
  profile_price: any;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const SubjectproviderSchema = SchemaFactory.createForClass(Subjectprovider);
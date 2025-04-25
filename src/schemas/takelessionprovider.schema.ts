import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Takelessionprovider {

  @Prop()
  name: string;

  @Prop()
  providerId: string;

  @Prop()
  scopes: string[];

  @Prop()
  profileImage: string;

  @Prop()
  tagline: string;

  @Prop()
  takelessonId: string;

  @Prop()
  serviceDescription: string;

  @Prop()
  level: string[];

  @Prop()
  Experience: string[];

  @Prop()
  Language: string[];

  @Prop()
  tutorDescription: string;

  @Prop()
  locations: string[];

  @Prop()
  gallery: string[];

  @Prop()
  AgeRange: any[];

  @Prop()
  award: string[];

  @Prop()
  affiliation: string[];

  @Prop()
  certification: string[];

  @Prop()
  ProvideServices: string[];

  @Prop()
  price: string[];

  @Prop()
  Timing: string[];

  @Prop()
  description: string;

  @Prop()
  Education: string[];

  @Prop()
  skills: string[];

  @Prop()
  subjects: string[];

  @Prop()
  rating: string;

  @Prop()
  reviews: string[];

  @Prop()
  class_price: string;

  @Prop()
  class_duration: string;

  @Prop()
  lesson_type: string;
  
  @Prop()
  lesson_description: string;

  @Prop()
  review_count: string;

  @Prop({ type: Object })  // or use `any` explicitly if needed
  tutorBooking: any;

  @Prop({ type: Object })  // or use `any` explicitly if needed
  reviewSummary: any;

  @Prop()
  profile_link: string;

  @Prop()
  from_url: string;
   
  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date; 


}

export const TakelessionproviderSchema = SchemaFactory.createForClass(Takelessionprovider);


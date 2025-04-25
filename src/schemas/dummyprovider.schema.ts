import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Dummyprovider {

  @Prop()
  userName: string[];

  @Prop()
  businessName: string[];

  @Prop()
  recommended_businessName: string;

  @Prop()
  emails: string[];

  @Prop()
  recommended_emails: string;

  @Prop()
  address: string[];

  @Prop()
  recommended_address: string;

  @Prop()
  phonenumbers: string[];

  @Prop()
  recommended_phonenumbers: string;
  
  @Prop()
  discription: string;

  // partyServices :boolean,privateInstructionTutoring :boolean,earlyDropOffLatePickup :boolean,transportServices :boolean

  @Prop()
  partyServices: boolean;

  @Prop()
  privateInstructionTutoring: boolean;

  @Prop()
  earlyDropOffLatePickup: boolean;

  @Prop()
  transportServices: boolean;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'queue',
    required: false,
  })
  queue: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  })
  provider: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'category', required: false }])
  finalCategory: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'tag', required: false }])
  finalSubcategory: string[];

  @Prop()
  url: string;

  @Prop()
  google_rating: number;

  @Prop()
  google_rating_count: number;

  @Prop()
  google_reviews: Array<object>;

  // @Prop()
  // location: Object;
  
  @Prop()
  category: string[];

  @Prop()
  subcategory: string[];

  @Prop()
  facebook_review_details: string[];

  @Prop()
  facebook_url: string;

  @Prop()
  facebook_profile_image: string;
  
  @Prop()
  facebook_banner_image: string;

  @Prop()
  instagram_profile_image: string;
  
  @Prop()
  instagram_banner_image: string;

  @Prop()
  facebook_followers: number;

  @Prop()
  facebook_likes: number;

  @Prop()
  instagram_url: string;

  @Prop()
  google_url: string;

  @Prop()
  instagram_followers: number;

  @Prop()
  instagram_likes: number;

  @Prop()
  facebook_rating: number;

  @Prop()
  facebook_reviews: number;

  @Prop()
  yelp_rating: number;

  @Prop()
  yelp_reviews: number;

  @Prop()
  yelp_url: string;

  @Prop()
  yelp_followers: number;

  @Prop()
  yelp_likes: number;

  @Prop()
  twitter_url: string;

  @Prop()
  twitter_followers: number;

  @Prop()
  twitter_likes: number;
  
  @Prop()
  place_id: string;

  @Prop()
  youtube_url: string;

  @Prop()
  youtube_followers: number;

  @Prop()
  youtube_likes: number;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop()
  website: string;

  @Prop()
  website_images: string[];

  @Prop()
  Staff: string[];

  @Prop()
  Licences: string[];

  @Prop()
  Licence_no: string;

  @Prop()
  Certifications: string[];

  @Prop()
  DaycareCapacity: string[];

  @Prop()
  LanguagesSpoken: string[];

  @Prop()
  CurriculumTeachingMethodology: string[];

  @Prop()
  Curriculum: string[];

  @Prop()
  CalendarInformation: string[];

  @Prop()
  FinancialAid: string[];

  @Prop()
  Schedules: string[];

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;


}

export const DummyproviderSchema = SchemaFactory.createForClass(Dummyprovider);

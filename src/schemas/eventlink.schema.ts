import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Citymanagement } from './citymanagement.schema';
import { Event_source } from './event_source.schema';
import { Tags } from './tags.schema';

export interface Eventlink extends Document {
  image_url: string;
  title: string;
  venue: string;
  time: string;
  distance: string;
  type: string;
  event_link: string;
  event_date: object;
  event_city: object;
  ageGroup: string;
  avalibility_dates: Date[];
  createdOn: Date;
  updatedOn: Date;
  description: string;
  price: string;
  summary: string;
  longitude: string;
  latitude: string;
  tickets_url: string;
  location: {
    name: string;
    fullAddress: string;
  };
  organizer: {
    name: string;
    url: string;
    orgWebsite: string;
    description: string;
    thumbnail: string;
  };
}

@Schema()
export class Eventlink {
  @Prop()
  image_url: string;

  @Prop()
  start_time: string;

  @Prop()
  start_date: string;

  @Prop()
  end_date: string;

  @Prop()
  end_time: string;

  @Prop()
  title: string;

  @Prop()
  venue: string;

  @Prop()
  time: string;

  @Prop({})
  type: string;

  @Prop({ default: 'in-person' })
  inpersonOrVirtual: string;

  @Prop()
  events_type: string[];

  @Prop({ default: 'No data available' })
  ageGroup: string;

  @Prop()
  distance: string;

  @Prop()
  price: string;

  @Prop()
  event_link: string;

  @Prop({ default: false })
  is_event_detail: boolean;

  @Prop({ default: false })
  childFriendly: boolean;

  @Prop({ default: false })
  familyFriendly: boolean;

  @Prop({ default: false })
  move_to_wondrfly: boolean;

  @Prop({ type: Object })
  event_date: object;

  @Prop({ type: Object })
  event_city: object;

  @Prop({ type: [Date], default: [] })
  avalibility_dates: Date[];

  @Prop()
  date_wise_link: string[];

  @Prop()
  isRegistration: boolean;

  @Prop()
  city: string;

  @Prop({})
  source: string;

  @Prop({ type: [String], default: [] })
  event_dates: string[];

  @Prop()
  audiance: string[];

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Citymanagement.name,
  })
  cityId: Citymanagement;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Event_source.name,
  })
  source_id: Event_source;

  @Prop([
    {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: Tags.name,
    },
  ])
  subjects: Tags;

  @Prop()
  description: string;

  @Prop()
  series_link: string;

  @Prop()
  summary: string;

  @Prop()
  longitude: string;

  @Prop()
  latitude: string;

  @Prop()
  tickets_url: string;

  @Prop()
  slug: string;

  @Prop({
    default: 'verified',
    Enum: [
      'unverified',
      'verified',
      'internal_proofreading',
      'final_proofreading',
      'archived',
    ],
  })
  status: string;

  @Prop({ type: Object })
  location: {
    name: string;
    fullAddress: string;
  };

  // @Prop({ type: Object, default: {
  //   'name': 'No data available',
  //   'url': 'No data available',
  //   'orgWebsite': 'No data available',
  //   'description': 'No data available',
  //   'thumbnail': 'No data available'
  // } })
  // organizer: {
  //   name: string;
  //   url: string;
  //   orgWebsite: string;
  //   description: string;
  //   thumbnail: string;
  // };

  @Prop({})
  notes: string;

  @Prop({})
  admin_notes: string;

  @Prop({ default: false })
  is_published: boolean;

  @Prop({})
  proof_reader_notes: string;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const EventlinkSchema = SchemaFactory.createForClass(Eventlink);

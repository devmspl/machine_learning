import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export interface Event extends Document {
  image_url: string;
  title: string;
  venue: string;
  time: string;
  distance: string;
  event_link: string;
  price: string;
  refundPolicy: string;
  event_date: {
    display: string;
    datetime: string;
  };
  event_city: string;
  createdOn: Date;
  updatedOn: Date;

  description: string;
  location: {
    name: string;
    fullAddress: string;
    coordinates: [number, number];
  };
  organizer: {
    name: string;
    url: string;
    orgWebsite: string;
    description: string;
    thumbnail: string;
  };
  providerName: string;
  providerUrl: string;
  providerImage: string;
}

@Schema()
export class Event {
  @Prop()
  image_url: string;

  @Prop()
  title: string;

  @Prop()
  venue: string;

  @Prop()
  time: string;

  @Prop()
  date: string;

  @Prop()
  city: string;

  @Prop()
  distance: string;

  @Prop({ default: 'No data available' })
  price: string;

  @Prop({ default: 'No data available' })
  priceLink: string;

  @Prop({ default: 'No data available' })
  refundPolicy: string;

  // @Prop({ type: Object,
  //   default: {
  //     month: [],
  //     year: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  //   }
  // })
  // ageGroup: {
  //   month: number[],
  //   year: number[]
  // };

  @Prop({
    type: Object,
    default: {
      month: [],
      year: [],
    },
  })
  ageGroup: {
    month: number[];
    year: number[];
  };

  @Prop()
  event_link: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eventlink',
    required: false,
  })
  event_link_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'citymanagement',
    required: false,
  })
  cityId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: false,
  })
  providerId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  })
  providerUserId: string;

  @Prop({ type: Object })
  event_date: {
    display: string;
    datetime: string;
  };

  @Prop({ type: String })
  event_city: string;

  @Prop({ type: [String] })
  event_times: string[];

  @Prop({ type: [String] })
  event_categories: string[];

  @Prop({ type: [String] })
  agenda: string[];

  @Prop()
  phone_number: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop()
  description: string;

  // @Prop(
  //   raw({
  //     type: {
  //       type: String,
  //       default: 'Point',
  //     },
  //     coordinates: [
  //       {
  //         type: Number,
  //       },
  //       {
  //         type: Number,
  //       },
  //     ],
  //     name: String,
  //     fullAddress: String,
  //   }),
  // )
  // location: {
  //   name: string;
  //   fullAddress: string;
  //   coordinates: [number, number];
  // };

  @Prop([
    {
      _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
      },
      name: String,
      address: String,
      location: {
        type: {
          type: String,
          default: 'Point',
        },
        coordinates: [
          {
            type: Number,
          },
          {
            type: Number,
          },
        ],
      },
      createdOn: {
        type: Date,
        default: Date.now,
      },
      updatedOn: {
        type: Date,
        default: Date.now,
      },
      __v: {
        type: Number,
        select: false,
      },
    },
  ])
  multiLocations: Array<{
    _id: string;
    name: string;
    address: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    createdOn: Date;
    updatedOn: Date;
  }>;

  @Prop({
    type: Object,
    default: {
      name: 'No data available',
      url: 'No data available',
      orgWebsite: 'No data available',
      description: 'No data available',
      thumbnail: 'No data available',
    },
  })
  organizer: {
    name: string;
    url: string;
    orgWebsite: string;
    description: string;
    thumbnail: string;
  };

  @Prop()
  providerName: string;

  @Prop()
  providerUrl: string;

  @Prop()
  providerImage: string;

  @Prop({ default: Date.now })
  createdOn: Date;

  @Prop({ default: Date.now })
  updatedOn: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Provider {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  user: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'tag', required: false }])
  subCategoryIds: string[];

  @Prop([
    { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: false },
  ])
  categories: string[];

  @Prop({ default: false })
  updateDescription: boolean;

  @Prop({ default: false })
  updateCategory: boolean;

  @Prop({ default: false })
  updateSubCategory: boolean;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'phonenumber',
      required: false,
    },
  ])
  primaryPhoneNumbers: string[];

  @Prop()
  userName: string;

  @Prop()
  businessName: string;

  @Prop()
  emails: string[];

  @Prop()
  address: string;

  @Prop()
  displayPhoneNumbers: string;

  @Prop()
  primaryAddress: string;

  @Prop()
  yelp: string;

  @Prop()
  skillGroups: string[];

  @Prop()
  gmb: string;

  @Prop({ default: 'No Info' })
  teamSize: string;

  @Prop({ default: false })
  isChildCare: boolean;

  @Prop({ default: false })
  providePrivateInstruction: boolean;

  @Prop({ default: false })
  provideInHomeInstruction: boolean;

  @Prop([String])
  instructor: string[];

  @Prop()
  instructorImages: string[];

  @Prop({ default: 0 })
  maximumTravelDistance: number;

  @Prop({ default: false })
  provideBirthdaySpecificServices: boolean;

  @Prop({ default: false })
  providePartyServices: boolean;

  @Prop({ default: false })
  provideTransportServicesToAndFromTheVenue: boolean;

  @Prop({ default: false })
  earlyDrop_off_LatePick_up: boolean;

  @Prop()
  activityTypes: string[];

  @Prop()
  privateVsGroup: string[];

  @Prop()
  inpersonOrVirtual: string[];

  @Prop()
  indoorOrOutdoor: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  addedBy: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  lastModifiedBy: string;

  @Prop()
  county: string;

  @Prop()
  about: string;

  @Prop()
  bio: string;

  @Prop()
  description: string;

  @Prop()
  facebook: string;

  @Prop()
  fullAddress: string;

  @Prop()
  hours: string;

  @Prop()
  imageURL: string;

  @Prop()
  linkedin: string;

  @Prop()
  listingURL: string;

  @Prop()
  banners: string[];

  @Prop()
  links: string[];

  @Prop()
  cycle: string;

  @Prop()
  alias: string;

  @Prop()
  activeStatus: string;

  @Prop()
  reviews: string;

  @Prop()
  twitter: string;

  @Prop()
  website: string;

  @Prop()
  youtube: string;

  @Prop()
  instagram: string;

  @Prop()
  awards: string;

  @Prop()
  taxNumber: string;

  @Prop({ default: false })
  merchantVerified: boolean;

  @Prop()
  isAssociate: string;

  @Prop()
  govtIdUrl: string;

  @Prop()
  govtIdNote: string;

  @Prop({ type: Object })
  healthAndSafety: Record<any, any>;

  @Prop()
  lastActive: string[];

  // @Prop()
  // source: string[];

  @Prop()
  sourceUrl: string[];

  @Prop()
  createdBy: string;

  @Prop()
  adminNotes: string;

  @Prop()
  logo: string;

  @Prop()
  cancellation_and_refund: string;

  @Prop({ default: '1970-06-28T12:32:06.247Z' })
  last_reviewed: Date;

  @Prop()
  next_reviewed: Date;

  @Prop({ default: 0 })
  cycle_time: number;

  @Prop()
  proof_reader_notes: string;

  @Prop()
  exceptionDates: string[];

  @Prop({ default: false })
  online: boolean;

  @Prop()
  joiningLink: string;

  @Prop({ default: false })
  student_location: boolean;

  @Prop(
    raw({
      coordinates: [
        {
          type: String,
        },
      ],
      address: String,
      maximumTravelDistance: String,
    }),
  )
  student_maximumTravelDistance: Record<string, any>;

  @Prop()
  provider_gallery: any[];

  @Prop({ default: 'regular' })
  providerType: 'solo' | 'regular' | string;

  @Prop()
  provider_video: string;

  @Prop()
  additionalInformation: string;

  @Prop({ default: false })
  myLocation: boolean;

  @Prop({ default: false })
  is_child_care: boolean;

  @Prop({ default: false })
  is_event: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  advanceAnalitcs: boolean;

  @Prop({ default: 'Not started' })
  isRequestVerified: 'Not started' | 'Processing' | 'Started' | string;

  @Prop({ default: 'Not started' })
  isCallBooking: 'Not started' | 'Booked' | 'Started' | string;

  @Prop()
  headline: string;

  @Prop(
    raw({
      facebookRating: {
        type: Number,
        default: 0,
      },
      facebookLikes: {
        type: Number,
        default: 0,
      },
      facebookLink: String,
      numberOfFacebook: {
        type: Number,
        default: 0,
      },
      googleRating: {
        type: Number,
        default: 0,
      },
      googleLink: String,
      numberOfGoogle: {
        type: Number,
        default: 0,
      },
      yelpRating: {
        type: Number,
        default: 0,
      },
      yelpLink: String,
      instagramLink: String,
      numberOfYelp: {
        type: Number,
        default: 0,
      },
      instagramFollowers: {
        type: Number,
        default: 0,
      },
    }),
  )
  rating: Record<string, any>;

  @Prop(
    raw([
      {
        language: {
          type: Number,
          default: 0,
        },
        proficiency: {
          type: Number,
          default: 0,
        },
      },
    ]),
  )
  languages: Record<string, any>;

  ////////////////// User's details /////////////////

  @Prop()
  googleReviewsURL: string;

  @Prop()
  googleProfileURL: string;

  @Prop()
  numberOfGoogleReviews: string;

  @Prop()
  numberOfGoogleRatings: string;

  @Prop()
  averageGoogleRating: string;

  @Prop()
  topGoogleReviews: string[];

  @Prop()
  bottomGoogleReviews: string[];

  @Prop()
  mostRecentGoogleReviews: string[];

  @Prop()
  facebookURL: string;

  @Prop()
  facebookNumberOfFollowers: string;

  @Prop()
  facebookNumberOfLikes: string;

  @Prop()
  yelpProfileURL: string;

  @Prop()
  numberOfYelpRatings: string;

  @Prop()
  averageYelpRating: string;

  @Prop()
  yelpTopReviews: string[];

  @Prop()
  yelpBottomReviews: string[];

  @Prop()
  yelpMostRecentReviews: string[];

  @Prop()
  instagramProfileLink: string;

  @Prop()
  numberOfInstagramFollowers: string;

  @Prop()
  websiteUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: false,
  })
  duplicateId: string;

  @Prop({ default: false })
  isDuplicate: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'citymanagement',
    required: false,
  })
  cityId: string;

  @Prop(
    raw([
      {
        name: { type: String, default: '' },
        role: { type: String, default: '' },
        qualifications: { type: String, default: '' },
        experience_years: { type: Number, default: 0 },
        languages_spoken: { type: [String], default: [] },
        certifications: { type: [String], default: [] },
      },
    ]),
  )
  Staff: Record<string, any>;

  @Prop(
    raw([
      {
        license_id: { type: String, default: '' },
        type: { type: String, default: '' },
        issued_date: { type: String, default: '' },
        expiry_date: { type: String, default: '' },
        issuing_authority: { type: String, default: '' },
      },
    ]),
  )
  Licences: Record<string, any>;

  @Prop(
    raw([
      {
        certification_name: { type: String, default: '' },
        description: { type: String, default: '' },
        issued_by: { type: String, default: '' },
        issued_date: { type: String, default: '' },
        expiry_date: { type: String, default: '' },
      },
    ]),
  )
  Certifications: Record<string, any>;

  @Prop(
    raw([
      {
        total_capacity: { type: String, default: '' },
        age_groups: { type: String, default: '' },
      },
    ]),
  )
  DaycareCapacity: Record<string, any>;

  @Prop({ type: [String], default: [] })
  LanguagesSpoken: string[];

  @Prop({ type: [String], default: [] })
  curriculum: string[];

  @Prop({ type: [String], default: [] })
  timing: string[];

  @Prop(
    raw([
      {
        schedule_type: { type: String, default: '' },
        start_date: { type: String, default: '' },
        end_date: { type: String, default: '' },
        holidays: { type: [String], default: [] },
      },
    ]),
  )
  CalendarInformation: Record<string, any>;

  @Prop(
    raw([
      {
        available: { type: Boolean, default: false },
        program_name: { type: String, default: '' },
        eligibility: { type: String, default: '' },
        coverage: { type: String, default: '' },
      },
    ]),
  )
  FinancialAid: Record<string, any>;

  @Prop(
    raw([
      {
        early_drop_off: { type: Boolean, default: false },
        night_hours: { type: Boolean, default: false },
        after_care: { type: Boolean, default: false },
        operating_start_time: { type: String, default: '' },
        operating_end_time: { type: String, default: '' },
      },
    ]),
  )
  Schedules: Record<string, any>;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);

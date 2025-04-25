import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  userName: string;

  @Prop()
  sex: string;

  @Prop()
  tagline: string;

  @Prop()
  age: number;

  @Prop()
  dob: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  type: 'chatgpt' | 'gemini' | string;

  @Prop()
  platForm: string;

  @Prop()
  platFormId: string;

  @Prop()
  avatarImages: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  addressLine1: string;

  @Prop()
  addressLine2: string;

  @Prop()
  street: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  source: string;

  @Prop()
  zipCode: string;

  @Prop()
  location: string;

  @Prop()
  stripeId: string;

  @Prop()
  lastLoggedIn: Date;

  @Prop()
  inviteBy: string;

  @Prop({ default: true })
  isActivated: boolean;

  @Prop()
  lastModifiedBy: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedBy: string;

  @Prop()
  deleteReason: string;

  @Prop()
  deleteReasonDetail: string;

  @Prop()
  deletedDate: Date;

  @Prop()
  token: string;

  @Prop()
  createdBy: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  createdByUser: string;

  @Prop()
  note: string;

  @Prop({ default: 0 })
  averageFinalRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: true })
  notificationsOnOff: boolean;

  @Prop({ default: false })
  isAmbassador: boolean;

  @Prop({ default: false })
  isUserVerified: boolean;

  @Prop({ default: Date.now() })
  isAmbassadorOn: Date;

  @Prop()
  role: 'superadmin' | 'admin' | 'mturkers' | 'provider' | string;

  @Prop()
  roles: 'superadmin' | 'admin' | 'mturkers' | 'purpleprovider' | string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isFav: boolean;

  @Prop()
  browserName: string;

  @Prop()
  ipAddress: string;

  @Prop()
  osName: string;

  @Prop({ default: 0 })
  loginCount: number;

  @Prop({ default: 0 })
  lastLoginTime: number;

  @Prop({ default: false })
  betaUser: boolean;

  @Prop({ default: false })
  isPasswordSet: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneNumberVerified: boolean;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;

  @Prop({ default: '1970-06-28T12:32:06.247Z' })
  last_reviewed: Date;

  @Prop()
  next_reviewed: Date;

  @Prop({ default: 'No' })
  providerCopy: string;

  @Prop({ default: false })
  reference: boolean;

  @Prop()
  changeDetection: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  referenceUser: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
  provider_reference: string;

  @Prop(
    raw([
      {
        osName: { type: String, default: '' },
        ip: { type: String, default: '' },
        browserName: { type: String, default: '' },
        deviceName: { type: String, default: '' },
        deviceType: { type: String, default: '' },
        loginDate: { type: Date, default: '' },
        lastSeen: { type: Date, default: '' },
        loginTime: { type: Number, default: 0 },
      },
    ]),
  )
  loginDetails: Record<string, any>[];

  @Prop({ default: 'Join the waitlist' })
  isInvitedBy:
    | string
    | 'Admin-assisted Users'
    | 'Friend Invitations'
    | 'Join the waitlist';

  @Prop({ default: false })
  testMode: boolean;

  @Prop({ default: false })
  memeberShipUpdate: boolean;

  @Prop()
  defaultSaveList: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'citymanagement',
    required: false,
  })
  cityId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'takelessionprovider',
    required: false,
  })
  takeLessonProviderId: string;

  @Prop({ default: 'purpleInvester' })
  addFrom: string;

  @Prop({ default: false })
  moveToWondrfly: boolean;

  @Prop({ default: false })
  webdump: boolean;

  @Prop({ default: false })
  moveInProduction: boolean;

  @Prop({ default: false })
  takeLessonProvider: boolean;

  @Prop({ default: 'Unverfied' })
  status: string;

  @Prop({ default: 0 })
  userUpdateCount: number;

  @Prop()
  address: string;

  @Prop({ default: false })
  userUpdateFirstTime: boolean;

  @Prop()
  website: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop()
  secondaryPhonenumber: string;

  //////////////////////////// EXTRA FIELD"S  HIDE AND SHOW ////////////////////////////////

  // @Prop()
  // fullname: string;
  // @Prop()
  // gender: 'male' | 'female';

  // @Prop()
  // phone_number: string;

  // @Prop()
  // googleReviewsURL: string;

  // @Prop()
  // numberOfGoogleReviews: string;

  // @Prop()
  // averageGoogleRating: string;

  // @Prop()
  // topGoogleReviews: string[];

  // @Prop()
  // bottomGoogleReviews: string[];

  // @Prop()
  // mostRecentGoogleReviews: string[];

  // @Prop()
  // facebookURL: string;

  // @Prop()
  // facebookNumberOfFollowers: string;

  // @Prop()
  // facebookNumberOfLikes: string;

  // @Prop()
  // yelpProfileURL: string;

  // @Prop()
  // numberOfYelpRatings: string;

  // @Prop()
  // averageYelpRating: string;

  // @Prop()
  // yelpTopReviews: string[];

  // @Prop()
  // yelpBottomReviews: string[];

  // @Prop()
  // yelpMostRecentReviews: string[];

  // @Prop()
  // instagramProfileLink: string;

  @Prop({ default: 'pending' })
  stage: 'dumped' | 'cleansed' | 'completed' | string;

  @Prop()
  facebookId: string;

  @Prop()
  googleId: string;

  // @Prop({ default: false })
  // isClaimed: boolean;

  // @Prop()
  // stripeToken: string;

  // @Prop()
  // stripeKey: string;

  // @Prop()
  // personalNote: string;

  // @Prop({ default: 0 })
  // loginLimit: number;

  // @Prop()
  // securityQuestion: string;

  // @Prop()
  // answer: string;

  // @Prop()
  // ssn: string;

  // @Prop({ default: false })
  // profileCompleteEmail: boolean;

  // @Prop({ default: false })
  // profileCompleteNotification: boolean;

  // @Prop()
  // weeklyDate: string;

  // @Prop()
  // resetPasswordToken: string;

  // @Prop()
  // resetPasswordExpires: Date;

  // @Prop({ default: 0 })
  // totalPoints: number;

  // @Prop({ default: 0 })
  // parentInvitationLimit: number;

  // @Prop({ default: 0 })
  // guardianInvitationLimit: number;

  // @Prop()
  // deviceToken: string;

  // @Prop({ default: false })
  // isFreeTrial: boolean;

  // @Prop({ default: false })
  // isOnBoardingDone: boolean;

  // @Prop({ default: Date.now() })
  // usercreatedOn: Date;

  // @Prop({ default: { count: 0 }, type: Object })
  // onBoardingCount: Record<string, any>;

  //////////////////////////////////////////////////////////////////////////////////////

  // @Prop({ default: null })
  // onBoardingDoneDate: Date;

  // @Prop(
  //   raw([
  //     {
  //       osName: { type: String, default: '' },
  //       ip: { type: String, default: '' },
  //       browserName: { type: String, default: '' },
  //       deviceName: { type: String, default: '' },
  //       deviceType: { type: String, default: '' },
  //       onBoardingDoneDate: { type: Date, default: '' },
  //     },
  //   ]),
  // )
  // onBoardingDoneFrom: Record<string, any>[];

  // @Prop(
  //   raw({
  //     step1: { type: Boolean, default: false },
  //     step1DoneTime: { type: Date },
  //     step2: { type: Boolean, default: false },
  //     step2DoneTime: { type: Date },
  //     step3: { type: Boolean, default: false },
  //     step3DoneTime: { type: Date },
  //     step4: { type: Boolean, default: false },
  //     step4DoneTime: { type: Date },
  //     step4Skip: { type: Boolean, default: false },
  //     step5: { type: Boolean, default: false },
  //     step5DoneTime: { type: Date },
  //     step6: { type: Boolean, default: false },
  //     step6DoneTime: { type: Date },
  //     addKidsOnBoarding: { type: Number, default: 0 },
  //   }),
  // )
  // onBoardingSteps: Record<string, any>;

  // @Prop()
  // sourceOfHearing: string;

  // @Prop()
  // topThreeIssues: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });

UserSchema.index({ phone_number: 1 });

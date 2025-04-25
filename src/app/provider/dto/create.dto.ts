import {
  IsString,
  IsArray,
  IsOptional,
  IsObject,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Location {
  @IsArray()
  @ApiProperty()
  coordinates: [number, number];
}

enum genderEnum {
  MALE = 'male',
  FEMALE = 'female',
}
class student_maximumTravelDistanceDto {
  @IsArray()
  @ApiProperty()
  coordinates: [number, number];
  @IsOptional()
  @ApiProperty()
  address: string;
  @IsOptional()
  @ApiProperty()
  maximumTravelDistance: string;
}

class ratingDto {
  @IsOptional()
  @ApiProperty()
  facebookRating: number;
  @IsOptional()
  @ApiProperty()
  facebookLikes: number;
  @IsOptional()
  @ApiProperty()
  facebookLink: string;
  @IsOptional()
  @ApiProperty()
  googleRating: number;
  @IsOptional()
  @ApiProperty()
  googleLink: string;
  @IsOptional()
  @ApiProperty()
  yelpRating: number;
  @IsOptional()
  @ApiProperty()
  yelpLink: string;
  @IsOptional()
  @ApiProperty()
  instagramLink: string;
  @IsOptional()
  @ApiProperty()
  numberOfYelp: number;
  @IsOptional()
  @ApiProperty()
  instagramFollowers: number;
  @IsOptional()
  @ApiProperty()
  numberOfFacebook: number;
  @IsOptional()
  @ApiProperty()
  numberOfGoogle: number;
}
export class createProviderDto {
  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @ApiProperty()
  user: string;

  @IsOptional()
  @ApiProperty()
  cityId: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // userName: string;

  @IsOptional()
  @ApiProperty()
  businessName: string;

  @IsOptional()
  @ApiProperty()
  subCategoryIds: string[];

  @IsOptional()
  @ApiProperty()
  categories: string[];

  @IsOptional()
  @ApiProperty()
  primaryPhoneNumbers: string[];

  @IsOptional()
  @ApiProperty()
  emails: string;

  @IsOptional()
  @ApiProperty({ type: Location })
  location: Location;

  @IsOptional()
  @ApiProperty()
  address: string;

  @IsOptional()
  @ApiProperty()
  status?: string | 'Unverfied' | 'Verified' | 'Archived';

  @IsOptional()
  @ApiProperty()
  displayPhoneNumbers: string;

  @IsOptional()
  @ApiProperty()
  primaryAddress: string;

  @IsOptional()
  @ApiProperty()
  yelp: string;

  @IsOptional()
  @ApiProperty()
  skillGroups: string[];

  @IsOptional()
  @ApiProperty()
  gmb: string;

  @IsOptional()
  @ApiProperty()
  teamSize: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isChildCare: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  providePrivateInstruction: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  provideInHomeInstruction: boolean;

  @IsOptional()
  @ApiProperty()
  instructor: string[];

  @IsOptional()
  @ApiProperty()
  maximumTravelDistance: number;

  @IsOptional()
  @ApiProperty({ default: false })
  provideBirthdaySpecificServices: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  providePartyServices: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  provideTransportServicesToAndFromTheVenue: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  earlyDrop_off_LatePick_up: boolean;

  @IsOptional()
  @ApiProperty()
  activityTypes: string[];

  @IsOptional()
  @ApiProperty()
  privateVsGroup: string[];

  @IsOptional()
  @ApiProperty()
  inpersonOrVirtual: string[];

  @IsOptional()
  @ApiProperty()
  indoorOrOutdoor: string[];

  @IsOptional()
  @ApiProperty()
  addedBy: string;

  // @IsOptional()
  // @ApiProperty()
  // lastModifiedBy: string;

  @IsOptional()
  @ApiProperty()
  county: string;

  @IsOptional()
  @ApiProperty()
  about: string;

  @IsOptional()
  @ApiProperty()
  bio: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  facebook: string;

  @IsOptional()
  @ApiProperty()
  fullAddress: string;

  @IsOptional()
  @ApiProperty()
  hours: string;

  @IsOptional()
  @ApiProperty()
  imageURL: string;

  @IsOptional()
  @ApiProperty()
  linkedin: string;

  @IsOptional()
  @ApiProperty()
  listingURL: string;

  @IsOptional()
  @ApiProperty()
  banners: string;

  @IsOptional()
  @ApiProperty()
  links: string;

  @IsOptional()
  @ApiProperty()
  cycle: string;

  @IsOptional()
  @ApiProperty()
  alias: string;

  @IsOptional()
  @ApiProperty()
  activeStatus: string;

  @IsOptional()
  @ApiProperty()
  reviews: string;

  @IsOptional()
  @ApiProperty()
  twitter: string;

  @IsOptional()
  @ApiProperty()
  website: string;

  @IsOptional()
  @ApiProperty()
  youtube: string;

  @IsOptional()
  @ApiProperty()
  instagram: string;

  @IsOptional()
  @ApiProperty()
  awards: string;

  @IsOptional()
  @ApiProperty()
  taxNumber: string;

  @IsOptional()
  @ApiProperty({ default: false })
  merchantVerified: boolean;

  @IsOptional()
  @ApiProperty()
  isAssociate: string;

  @IsOptional()
  @ApiProperty()
  govtIdUrl: string;

  @IsOptional()
  @ApiProperty()
  govtIdNote: string;

  @IsOptional()
  @ApiProperty()
  healthAndSafety: Record<any, any>;

  @IsOptional()
  @ApiProperty()
  lastActive: string[];

  // @IsOptional()
  // @ApiProperty()
  // source: string[];

  @IsOptional()
  @ApiProperty()
  sourceUrl: string[];

  // @IsOptional()
  // @ApiProperty()
  // createdBy: string;

  @IsOptional()
  @ApiProperty()
  adminNotes: string;

  @IsOptional()
  @ApiProperty()
  logo: string;

  @IsOptional()
  @ApiProperty()
  cancellation_and_refund: string;

  // @IsOptional()
  // @ApiProperty()
  // last_reviewed: Date;

  // @IsOptional()
  // @ApiProperty()
  // next_reviewed: Date;

  @IsOptional()
  @ApiProperty()
  cycle_time: number;

  @IsOptional()
  @ApiProperty()
  proof_reader_notes: string;

  @IsOptional()
  @ApiProperty()
  exceptionDates: string[];

  @IsOptional()
  @ApiProperty()
  online: boolean;

  @IsOptional()
  @ApiProperty()
  joiningLink: string;

  @IsOptional()
  @ApiProperty({ default: false })
  student_location: boolean;

  @IsOptional()
  @ApiProperty({ type: student_maximumTravelDistanceDto })
  student_maximumTravelDistance: student_maximumTravelDistanceDto;

  @IsOptional()
  @ApiProperty()
  provider_gallery: string[];

  @IsOptional()
  @ApiProperty()
  providerType: string;

  @IsOptional()
  @ApiProperty()
  provider_video: string;

  @IsOptional()
  @ApiProperty()
  additionalInformation: string;

  @IsOptional()
  @ApiProperty({ default: false })
  myLocation: boolean;

  @IsOptional()
  @ApiProperty()
  headline: string;

  @IsOptional()
  @ApiProperty({ type: ratingDto })
  rating: ratingDto;

  ////////// user's fields //////////

  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @ApiProperty()
  userName: string;

  @IsOptional()
  @IsEnum(genderEnum)
  @ApiProperty()
  sex: string;

  @IsOptional()
  @ApiProperty()
  age: number;

  @IsOptional()
  @ApiProperty()
  dob: string;

  @IsOptional()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  type: string;

  @IsOptional()
  @ApiProperty()
  facebookId: string;

  @IsOptional()
  @ApiProperty()
  googleId: string;

  @IsOptional()
  @ApiProperty()
  avatarImages: string;

  @IsOptional()
  @ApiProperty()
  secondaryPhonenumber: string;

  @IsOptional()
  @ApiProperty()
  addressLine1: string;

  @IsOptional()
  @ApiProperty()
  addressLine2: string;

  @IsOptional()
  @ApiProperty()
  street: string;

  @IsOptional()
  @ApiProperty()
  state: string;

  @IsOptional()
  @ApiProperty()
  city: string;

  @IsOptional()
  @ApiProperty()
  country: string;

  @IsOptional()
  @ApiProperty()
  source: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isClaimed: boolean;

  @IsOptional()
  @ApiProperty()
  zipCode: string;

  // @IsOptional()
  // @ApiProperty({ type: Location })
  // location: Location;

  @IsOptional()
  @ApiProperty()
  stripeToken: string;

  @IsOptional()
  @ApiProperty()
  stripeKey: string;

  @IsOptional()
  @ApiProperty()
  lastLoggedIn: Date;

  @IsOptional()
  @ApiProperty()
  personalNote: string;

  @IsOptional()
  @ApiProperty({ default: 0 })
  loginLimit: number;

  @IsOptional()
  @ApiProperty()
  securityQuestion: string;

  @IsOptional()
  @ApiProperty()
  answer: string;

  @IsOptional()
  @ApiProperty()
  inviteBy: string;

  @IsOptional()
  @ApiProperty()
  ssn: string;

  @IsOptional()
  @ApiProperty({ default: true })
  isActivated: boolean;

  @IsOptional()
  @ApiProperty()
  lastModifiedBy: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isDeleted: boolean;

  @IsOptional()
  @ApiProperty()
  deletedBy: string;

  @IsOptional()
  @ApiProperty()
  deleteReason: string;

  @IsOptional()
  @ApiProperty()
  deleteReasonDetail: string;

  @IsOptional()
  @ApiProperty()
  deletedDate: Date;

  @IsOptional()
  @ApiProperty()
  token: string;

  @IsOptional()
  @ApiProperty()
  createdBy: string;

  @IsOptional()
  @ApiProperty()
  createdByUser: string;

  @IsOptional()
  @ApiProperty()
  note: string;

  @IsOptional()
  @ApiProperty({ default: 0 })
  averageFinalRating: number;

  @IsOptional()
  @ApiProperty({ default: 0 })
  totalReviews: number;

  @IsOptional()
  @ApiProperty({ default: true })
  notificationsOnOff: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  profileCompleteEmail: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  profileCompleteNotification: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isAmbassador: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isUserVerified: boolean;

  @IsOptional()
  @ApiProperty({ default: Date.now() })
  isAmbassadorOn: Date;

  @IsOptional()
  @ApiProperty()
  weeklyDate: string;

  @IsOptional()
  @ApiProperty()
  role: string;

  @IsOptional()
  @ApiProperty()
  roles: string;

  @IsOptional()
  @ApiProperty()
  resetPasswordToken: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isPhoneVerified: boolean;

  @IsOptional()
  @ApiProperty({ default: 0 })
  totalPoints: number;

  @IsOptional()
  @ApiProperty({ default: false })
  isFav: boolean;

  @IsOptional()
  @ApiProperty({ default: 0 })
  parentInvitationLimit: number;

  @IsOptional()
  @ApiProperty({ default: 0 })
  guardianInvitationLimit: number;

  @IsOptional()
  @ApiProperty()
  browserName: string;

  @IsOptional()
  @ApiProperty()
  ipAddress: string;

  @IsOptional()
  @ApiProperty()
  osName: string;

  @IsOptional()
  @ApiProperty({ default: 0 })
  loginCount: number;

  @IsOptional()
  @ApiProperty({ default: 0 })
  lastLoginTime: number;

  @IsOptional()
  @ApiProperty()
  deviceToken: string;

  @IsOptional()
  @ApiProperty({ default: false })
  betaUser: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isFreeTrial: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isOnBoardingDone: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isPasswordSet: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isEmailVerified: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isPhoneNumberVerified: boolean;

  @IsOptional()
  @ApiProperty({ default: Date.now() })
  createdOn: Date;

  @IsOptional()
  @ApiProperty({ default: Date.now() })
  usercreatedOn: Date;

  @IsOptional()
  @ApiProperty({ default: Date.now() })
  updatedOn: Date;

  @IsOptional()
  @ApiProperty({ default: '1970-06-28T12:32:06.247Z' })
  last_reviewed: Date;

  @IsOptional()
  @ApiProperty()
  next_reviewed: Date;

  @IsOptional()
  @ApiProperty({ default: 'No' })
  providerCopy: string;

  @IsOptional()
  @ApiProperty({ default: false })
  reference: boolean;

  @IsOptional()
  @ApiProperty()
  referenceUser: string;

  @IsOptional()
  @ApiProperty()
  provider_reference: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({})
  onBoardingCount: object;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  moveToWondrfly: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  is_deleted: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  googleReviewsURL: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  // numberOfGoogleReviews: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  numberOfGoogleReviews: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  averageGoogleRating: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  topGoogleReviews: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  bottomGoogleReviews: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  mostRecentGoogleReviews: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  facebookURL: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  facebookNumberOfFollowers: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  facebookNumberOfLikes: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  yelpProfileURL: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  numberOfYelpRatings: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  averageYelpRating: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  yelpTopReviews: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  yelpBottomReviews: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  yelpMostRecentReviews: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  instagramProfileLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  numberOfInstagramFollowers: string;
}

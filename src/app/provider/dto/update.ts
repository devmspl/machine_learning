import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Location {
  @IsArray()
  @ApiProperty()
  coordinates: [number, number];
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
export class updateProviderDto {
  @IsOptional()
  @ApiProperty()
  user: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  userName: string;

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

  // @IsOptional()
  // @ApiProperty({ type: Location })
  // location: Location;

  @IsOptional()
  @ApiProperty()
  address: string;

  @IsOptional()
  @ApiProperty()
  displayPhoneNumbers: string;

  @IsOptional()
  @ApiProperty()
  status?: string | 'Unverfied' | 'Verified' | 'Archived';

  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

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
  @ApiProperty()
  isChildCare: boolean;

  @IsOptional()
  @ApiProperty()
  providePrivateInstruction: boolean;

  @IsOptional()
  @ApiProperty()
  provideInHomeInstruction: boolean;

  @IsOptional()
  @ApiProperty()
  instructor: string[];

  @IsOptional()
  @ApiProperty()
  maximumTravelDistance: number;

  @IsOptional()
  @ApiProperty()
  provideBirthdaySpecificServices: boolean;

  @IsOptional()
  @ApiProperty()
  providePartyServices: boolean;

  @IsOptional()
  @ApiProperty()
  provideTransportServicesToAndFromTheVenue: boolean;

  @IsOptional()
  @ApiProperty()
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

  @IsOptional()
  @ApiProperty()
  lastModifiedBy: string;

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
  banners: string[];

  @IsOptional()
  @ApiProperty()
  links: string[];

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
  @ApiProperty()
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

  @IsOptional()
  @ApiProperty()
  source: string[];

  @IsOptional()
  @ApiProperty()
  sourceUrl: string[];

  @IsOptional()
  @ApiProperty()
  createdBy: string;

  @IsOptional()
  @ApiProperty()
  adminNotes: string;

  @IsOptional()
  @ApiProperty()
  logo: string;

  @IsOptional()
  @ApiProperty()
  cancellation_and_refund: string;

  @IsOptional()
  @ApiProperty()
  last_reviewed: Date;

  @IsOptional()
  @ApiProperty()
  next_reviewed: Date;

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
  @ApiProperty()
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
  @ApiProperty()
  myLocation: boolean;

  @IsOptional()
  @ApiProperty()
  headline: string;

  @IsOptional()
  @ApiProperty({ type: ratingDto })
  rating: ratingDto;

  @IsOptional()
  @IsString()
  @ApiProperty()
  googleReviewsURL: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  googleProfileURL: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  numberOfGoogleReviews: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  numberOfGoogleRatings: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  averageGoogleRating: string;

  @IsOptional()
  @ApiProperty()
  topGoogleReviews: string[];

  @IsOptional()
  @ApiProperty()
  bottomGoogleReviews: string[];

  @IsOptional()
  @ApiProperty()
  mostRecentGoogleReviews: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  facebookURL: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  facebookNumberOfFollowers: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  facebookNumberOfLikes: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  yelpProfileURL: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  numberOfYelpRatings: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  averageYelpRating: string;

  @IsOptional()
  @ApiProperty()
  yelpTopReviews: string[];

  @IsOptional()
  @ApiProperty()
  yelpBottomReviews: string[];

  @IsOptional()
  @ApiProperty()
  yelpMostRecentReviews: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  instagramProfileLink: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  numberOfInstagramFollowers: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  websiteUrl: string;

  @IsOptional()
  @ApiProperty()
  cityId: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  moveToWondrfly: boolean;
}

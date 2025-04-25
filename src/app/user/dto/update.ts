import {
  IsEmail,
  IsStrongPassword,
  IsString,
  IsNumber,
  IsDateString,
  IsObject,
  IsNumberString,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum genderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

enum roleEnum {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  MTURKERS = 'mturkers',
  PURPLEPROVIDER = 'purpleprovider',
}

enum roleEnum1 {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  MTURKERS = 'mturkers',
  PURPLEPROVIDER = 'provider',
}

class UserLocation {
  @IsArray()
  @ApiProperty()
  coordinates: [number, number];
}

class Location {
  @IsArray()
  @ApiProperty()
  coordinates: [number, number];
}

enum statusEnum {
  UNVERIFIED = 'Unverfied',
  VERIFIED = 'Verified',
  ARCHIVED = 'Archived',
}

class LoginDetails {
  @IsOptional()
  @IsString()
  @ApiProperty()
  osName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ip: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  browserName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  deviceName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  deviceType: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  loginDate: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  lastSeen: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  loginTime: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  userName: string;

  @IsOptional()
  @IsString()
  @IsEnum(genderEnum)
  @ApiProperty()
  sex: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  age: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  dob: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  platForm: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  platFormId: string;

  @IsOptional()
  @ApiProperty()
  avatarImages: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  addressLine1: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  addressLine2: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  street: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  state: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  city: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  source: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  zipCode: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: Location })
  location: Location;

  @IsOptional()
  @IsString()
  @ApiProperty()
  stripeId: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  lastLoggedIn: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  inviteBy: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: true })
  isActivated: boolean;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  lastModifiedBy: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isDeleted: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  deletedBy: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  deleteReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  deleteReasonDetail: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  deletedDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  token: string;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  createdBy: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  createdByUser: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  note: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  averageFinalRating: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  totalReviews: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: true })
  notificationsOnOff: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isAmbassador: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isUserVerified: boolean;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ default: Date.now() })
  isAmbassadorOn: Date;

  @IsOptional()
  @IsString()
  @IsEnum(roleEnum1)
  @ApiProperty()
  role: string;

  @IsOptional()
  @IsString()
  @IsEnum(roleEnum)
  @ApiProperty()
  roles: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isPhoneVerified: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isFav: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  browserName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ipAddress: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  osName: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  loginCount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  lastLoginTime: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  betaUser: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isPasswordSet: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isEmailVerified: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isPhoneNumberVerified: boolean;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ default: Date.now() })
  createdOn: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ default: Date.now() })
  updatedOn: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ default: '1970-06-28T12:32:06.247Z' })
  last_reviewed: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  next_reviewed: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'No' })
  providerCopy: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  reference: boolean;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  referenceUser: string;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  provider_reference: string;

  @IsOptional()
  @ApiProperty({ type: LoginDetails })
  loginDetails: LoginDetails;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  isInvitedBy: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  testMode: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  memeberShipUpdate: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  defaultSaveList: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  cityId: string;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  addFrom: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  moveToWondrfly: boolean;

  @IsOptional()
  @IsEnum(statusEnum)
  @IsString()
  @ApiProperty({ default: 'Unverfied' })
  status: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  userUpdateCount: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  userUpdateFirstTime: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  website: string;

  @IsOptional()
  @ApiProperty({ default: false })
  is_deleted: boolean;

  @IsOptional()
  @ApiProperty()
  secondaryPhonenumber: string;

  ////////////////////////////////// EXTRA FIELD"S AND MOVED IN PROVIDER  ////////////////////////////////

  // @IsOptional()
  // @ApiProperty()
  // facebookId: string;

  // @IsOptional()
  // @ApiProperty()
  // googleId: string;

  // @IsOptional()
  // @ApiProperty({ default: false })
  // isClaimed: boolean;

  // @IsOptional()
  // @ApiProperty()
  // stripeToken: string;

  // @IsOptional()
  // @ApiProperty()
  // stripeKey: string;

  // @IsOptional()
  // @ApiProperty()
  // personalNote: string;

  // @IsOptional()
  // @ApiProperty({ default: 0 })
  // loginLimit: number;

  // @IsOptional()
  // @ApiProperty()
  // securityQuestion: string;

  // @IsOptional()
  // @ApiProperty()
  // answer: string;

  // @IsOptional()
  // @ApiProperty()
  // ssn: string;

  // @IsOptional()
  // @ApiProperty({ default: false })
  // profileCompleteEmail: boolean;

  // @IsOptional()
  // @ApiProperty({ default: false })
  // profileCompleteNotification: boolean;

  // @IsOptional()
  // @ApiProperty()
  // weeklyDate: string;

  // @IsOptional()
  // @ApiProperty()
  // resetPasswordToken: string;

  // @IsOptional()
  // @ApiProperty({ default: 0 })
  // totalPoints: number;

  // @IsOptional()
  // @ApiProperty({ default: 0 })
  // parentInvitationLimit: number;

  // @IsOptional()
  // @ApiProperty({ default: 0 })
  // guardianInvitationLimit: number;

  // @IsOptional()
  // @ApiProperty()
  // deviceToken: string;

  // @IsOptional()
  // @ApiProperty({ default: false })
  // isFreeTrial: boolean;

  // @IsOptional()
  // @ApiProperty({ default: false })
  // isOnBoardingDone: boolean;

  // @IsOptional()
  // @ApiProperty({ default: Date.now() })
  // usercreatedOn: Date;

  // @IsOptional()
  // @IsObject()
  // @ApiProperty({})
  // onBoardingCount: object;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // fullname: string;

  // @IsOptional()
  // // @IsEmail()
  // @ApiProperty()
  // email: string;

  // @IsOptional()
  // @ApiProperty()
  // dob: string;

  // @IsOptional()
  // @IsEnum(genderEnum)
  // @ApiProperty()
  // gender: string;

  // @IsOptional()
  // @ApiProperty()
  // phone_number: string;

  // // @IsOptional()
  // // @IsObject()
  // // @ApiProperty({ type: UserLocation })
  // // location: UserLocation;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // address: string;

  // @IsOptional()
  // @ApiProperty()
  // websiteUrl: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // googleReviewsURL: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // numberOfGoogleReviews: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // averageGoogleRating: string;

  // @IsOptional()
  // @ApiProperty()
  // topGoogleReviews: string[];

  // @IsOptional()
  // @ApiProperty()
  // bottomGoogleReviews: string[];

  // @IsOptional()
  // @ApiProperty()
  // mostRecentGoogleReviews: string[];

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // facebookURL: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // facebookNumberOfFollowers: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // facebookNumberOfLikes: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // yelpProfileURL: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // numberOfYelpRatings: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // averageYelpRating: string;

  // @IsOptional()
  // @ApiProperty()
  // yelpTopReviews: string[];

  // @IsOptional()
  // @ApiProperty()
  // yelpBottomReviews: string[];

  // @IsOptional()
  // @ApiProperty()
  // yelpMostRecentReviews: string[];

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // instagramProfileLink: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // numberOfInstagramFollowers: string;

  // @IsOptional()
  // @ApiProperty({ default: false })
  // userUpdateFirstTime: boolean;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // cityId: string;

  // @IsOptional()
  // @IsEnum(statusEnum)
  // @IsString()
  // @ApiProperty({ default: 'Unverfied' })
  // status: string;

  // @IsOptional()
  // @IsNumber()
  // @ApiProperty()
  // userUpdateCount: number;
}

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  old_password: string;

  @IsStrongPassword()
  @ApiProperty()
  new_password: string;
}

export class ForgetPassword {
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class verifyPasswordOtp {
  @IsString()
  @ApiProperty()
  token: string;

  @IsNumberString()
  @ApiProperty()
  otp: string;
}

export class resetPasswordDto {
  @IsStrongPassword()
  @ApiProperty()
  password: string;
}

import {
  IsString,
  IsArray,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Location {
  @IsArray()
  @ApiProperty()
  coordinates: [number, number];
}

class activityRecurring {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  activityRecurring: boolean;
  @IsOptional()
  @IsArray()
  @ApiProperty()
  days: string[];
}

class date {
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  from: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  to: Date;
}

class time {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  from: number;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  to: number;
}

class bookingCancelledIn {
  @IsOptional()
  @IsString()
  @ApiProperty()
  days: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  hours: string;
}

class duration {
  @IsOptional()
  @IsString()
  @ApiProperty()
  hours: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  minutes: string;
}

class pricePeriod {
  @IsOptional()
  @IsString()
  @ApiProperty()
  periodAmount: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  periodCount: number;
}

class capacity {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  min: number;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  max: number;
}

class batches {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  startDate: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  endDate: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  startTime: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  endTime: Date;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isFree: boolean;
  @IsOptional()
  @IsString()
  @ApiProperty()
  pricePerParticipant: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  instructor: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  numberOfSeats: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  location: string;
}

class sessions {
  @IsOptional()
  @IsString()
  @ApiProperty()
  sessionName: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  sessionAddress: string;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  sessionStartDate: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  sessionEndDate: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  sessionStartTime: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  sessionEndTime: Date;
  @IsOptional()
  @IsString()
  @ApiProperty()
  noOfSeats: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  instructor: string;
}

class days {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  sunday: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  monday: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  tuesday: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  wednesday: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  thursday: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  friday: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  saturday: boolean;
}

class registrationDates {
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  startDate: Date;
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  endDate: Date;
}

class pricePerUnit {
  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Price per class' })
  unit: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  actualPrice: number;
}

class questionAndAnswer {
  @IsOptional()
  @IsString()
  @ApiProperty()
  question: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  answer1: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  answer2: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  other: string;
}

class groupDiscount {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  noOfStudents: number;
  @IsOptional()
  @IsString()
  @ApiProperty()
  discountPercent: string;
}

class meetGreetDuration {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  hours: number;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  minutes: number;
}
class skillLevel {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  isCustom: boolean;
}

class extraPrices {
  @IsOptional()
  @IsString()
  @ApiProperty()
  pricePerUnit: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  pricePerParticipant: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  pricePerHour: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  classDuration: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  youEarn: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 0 })
  noOfUnits: number;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  priceProrated: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ default: false })
  setDefault: boolean;
  @IsOptional()
  @IsString()
  @ApiProperty()
  additionalInfo: string;
}

export class createProgramDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  providerName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  inpersonOrVirtual: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  primaryPhoneNumbers: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  displayPhoneNumbers: string;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  earlyDrop_off_LatePick_up: object;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  canParentsParticipateInActivity: boolean;

  // @IsObject()
  // @IsOptional()
  // @ApiProperty({ type: Location })
  // location: Location;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  maxStudentsPerClass: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  seatsAvailable: number;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: activityRecurring })
  activityRecurring: activityRecurring;

  @IsString()
  @IsOptional()
  @ApiProperty()
  indoorOroutdoor: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  skillGroups: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  source: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sourceUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  cycle: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  activeStatus: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  alias: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  type: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  price: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  joiningLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  tempProgramId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  presenter: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  programCoverPicl: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'active' })
  status: 'active' | 'inactive' | string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'unverified' })
  verifiedstatus:
    | 'verified'
    | 'unverified'
    | 'declined'
    | 'internal_proofreading'
    | 'final_proofreading'
    | string;

  // @IsString()
  @IsOptional()
  @ApiProperty()
  timelinePics: string[];

  @IsObject()
  @IsOptional()
  @ApiProperty()
  ageGroup: object;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: date })
  date: date;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isDateNotMention: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isPriceNotMention: boolean;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: time })
  time: time;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isTimeNotMention: boolean;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: bookingCancelledIn })
  bookingCancelledIn: bookingCancelledIn;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: duration })
  duration: duration;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isPublished: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isFree: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isFav: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  pricePerParticipant: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  priceForSiblings: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  specialInstructions: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  adultAssistanceIsRequried: boolean;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: pricePeriod })
  pricePeriod: pricePeriod;

  @IsString()
  @IsOptional()
  @ApiProperty()
  priceUnit: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: capacity })
  capacity: capacity;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  emails: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [batches] })
  batches: batches[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  user: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  addresses: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [sessions] })
  sessions: sessions[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  programImage: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastModifiedBy: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: days })
  days: days;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  exceptionDates: string[];

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  extractionDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  extractor_notes: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  extractor_url: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  proofreaderObservation: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  extractionComment: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  cyrilComment: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  cyrilApproval: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  proofreaderRating: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  programRating: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  dbStatus: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  parentRequired: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sessionLength: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isExpired: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  expireReason: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isproRated: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isFreeTrial: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  per_hour_rate: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  cycle_time: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  addedBy: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  proof_reader_notes: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isParentJoin: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isChildCare: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  privateOrGroup: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  maxTravelDistance: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: 0 })
  totalSessionClasses: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  offerDiscount: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isParentGuardianRequire: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  isOpenForBooking: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  zip: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  last_reviewed: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  next_reviewed: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  addedByCreatedOn: Date;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: registrationDates })
  registrationDates: registrationDates;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isDateFlexible: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isDayNotMention: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isDayFlexible: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isTimeFlexible: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  dateOption: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  dayOption: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  timeOption: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  maxNumberOfStudents: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  parentalSupervisionRequired: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  pricing: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: pricePerUnit })
  pricePerUnit: pricePerUnit;

  @IsString()
  @IsOptional()
  @ApiProperty()
  skillGroup: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [questionAndAnswer] })
  questionAndAnswer: questionAndAnswer[];

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: groupDiscount })
  groupDiscount: groupDiscount;

  @IsString()
  @IsOptional()
  @ApiProperty()
  youEarn: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: meetGreetDuration })
  meetGreetDuration: meetGreetDuration;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: skillLevel })
  skillLevel: skillLevel;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [extraPrices] })
  extraPrices: extraPrices[];

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [] })
  prices: any[];

  @IsString()
  @IsOptional()
  @ApiProperty({ default: null })
  providerEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: null })
  locationOfActivity: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  multiLocations: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty()
  instructor: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  schedule: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  subCategoryIds: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty()
  categoryId: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  cityId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'purpleInvester' })
  addFrom: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  moveToWondrfly: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isArchived: boolean;
}

import { IsString, IsArray, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Location {
  @IsArray()
  @ApiProperty()
  coordinates: [number, number];
}

class activityRecurring {
  @IsOptional()
  @ApiProperty({ default: false })
  activityRecurring: boolean;
  @IsOptional()
  @ApiProperty()
  days: string[];
}

class date {
  @IsOptional()
  @ApiProperty()
  from: Date;
  @IsOptional()
  @ApiProperty()
  to: Date;
}

class time {
  @IsOptional()
  @ApiProperty({ default: 0 })
  from: number;
  @IsOptional()
  @ApiProperty({ default: 0 })
  to: number;
}

class bookingCancelledIn {
  @IsOptional()
  @ApiProperty()
  days: string;
  @IsOptional()
  @ApiProperty()
  hours: string;
}

class duration {
  @IsOptional()
  @ApiProperty()
  hours: string;
  @IsOptional()
  @ApiProperty()
  minutes: string;
}

class pricePeriod {
  @IsOptional()
  @ApiProperty()
  periodAmount: string;
  @IsOptional()
  @ApiProperty({ default: 0 })
  periodCount: number;
}

class capacity {
  @IsOptional()
  @ApiProperty({ default: 0 })
  min: number;
  @IsOptional()
  @ApiProperty({ default: 0 })
  max: number;
}

class batches {
  @IsOptional()
  @ApiProperty()
  name: string;
  @IsOptional()
  @ApiProperty()
  startDate: Date;
  @IsOptional()
  @ApiProperty()
  endDate: Date;
  @IsOptional()
  @ApiProperty()
  startTime: Date;
  @IsOptional()
  @ApiProperty()
  endTime: Date;
  @IsOptional()
  @ApiProperty({ default: false })
  isFree: boolean;
  @IsOptional()
  @ApiProperty()
  pricePerParticipant: string;
  @IsOptional()
  @ApiProperty()
  instructor: string;
  @IsOptional()
  @ApiProperty()
  numberOfSeats: string;
  @IsOptional()
  @ApiProperty()
  location: string;
}

class sessions {
  @IsOptional()
  @ApiProperty()
  sessionName: string;
  @IsOptional()
  @ApiProperty()
  sessionAddress: string;
  @IsOptional()
  @ApiProperty()
  sessionStartDate: Date;
  @IsOptional()
  @ApiProperty()
  sessionEndDate: Date;
  @IsOptional()
  @ApiProperty()
  sessionStartTime: Date;
  @IsOptional()
  @ApiProperty()
  sessionEndTime: Date;
  @IsOptional()
  @ApiProperty()
  noOfSeats: string;
  @IsOptional()
  @ApiProperty()
  instructor: string;
}

class days {
  @IsOptional()
  @ApiProperty({ default: false })
  sunday: boolean;
  @IsOptional()
  @ApiProperty({ default: false })
  monday: boolean;
  @IsOptional()
  @ApiProperty({ default: false })
  tuesday: boolean;
  @IsOptional()
  @ApiProperty({ default: false })
  wednesday: boolean;
  @IsOptional()
  @ApiProperty({ default: false })
  thursday: boolean;
  @IsOptional()
  @ApiProperty({ default: false })
  friday: boolean;
  @IsOptional()
  @ApiProperty({ default: false })
  saturday: boolean;
}

class registrationDates {
  @IsOptional()
  @ApiProperty()
  startDate: Date;
  @IsOptional()
  @ApiProperty()
  endDate: Date;
}

class pricePerUnit {
  @IsOptional()
  @ApiProperty({ default: 'Price per class' })
  unit: string;
  @IsOptional()
  @ApiProperty({ default: 0 })
  actualPrice: number;
}

class questionAndAnswer {
  @IsOptional()
  @ApiProperty()
  question: string;
  @IsOptional()
  @ApiProperty()
  answer1: string;
  @IsOptional()
  @ApiProperty()
  answer2: string;
  @IsOptional()
  @ApiProperty()
  other: string;
}

class groupDiscount {
  @IsOptional()
  @ApiProperty({ default: 0 })
  noOfStudents: number;
  @IsOptional()
  @ApiProperty()
  discountPercent: string;
}

class meetGreetDuration {
  @IsOptional()
  @ApiProperty({ default: 0 })
  hours: number;
  @IsOptional()
  @ApiProperty({ default: 0 })
  minutes: number;
}
class skillLevel {
  @IsOptional()
  @ApiProperty()
  title: string;
  @IsOptional()
  @ApiProperty()
  description: string;
  @IsOptional()
  @ApiProperty({ default: false })
  isCustom: boolean;
}

class extraPrices {
  @IsOptional()
  @ApiProperty()
  pricePerUnit: string;
  @IsOptional()
  @ApiProperty()
  pricePerParticipant: string;
  @IsOptional()
  @ApiProperty()
  pricePerHour: string;
  @IsOptional()
  @ApiProperty()
  classDuration: string;
  @IsOptional()
  @ApiProperty()
  youEarn: string;
  @IsOptional()
  @ApiProperty({ default: 0 })
  noOfUnits: number;
  @IsOptional()
  @ApiProperty({ default: false })
  priceProrated: boolean;
  @IsOptional()
  @ApiProperty({ default: false })
  setDefault: boolean;
  @IsOptional()
  @IsString()
  @ApiProperty()
  additionalInfo: string;
}

export class updateProgramDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  providerName: string;

  @IsOptional()
  @ApiProperty()
  earlyDrop_off_LatePick_up: object;

  @IsOptional()
  @ApiProperty({ default: false })
  canParentsParticipateInActivity: boolean;

  // @IsOptional()
  // @ApiProperty({ type: Location })
  // location: Location;

  @IsOptional()
  @ApiProperty({ default: 0 })
  maxStudentsPerClass: number;

  @IsOptional()
  @ApiProperty({ default: 0 })
  seatsAvailable: number;

  @IsOptional()
  @ApiProperty({ type: activityRecurring })
  activityRecurring: activityRecurring;

  @IsOptional()
  @ApiProperty()
  indoorOroutdoor: string;

  @IsOptional()
  @ApiProperty()
  skillGroups: string;

  @IsOptional()
  @ApiProperty()
  source: string;

  @IsOptional()
  @ApiProperty()
  sourceUrl: string;

  @IsOptional()
  @ApiProperty()
  city: string;

  @IsOptional()
  @ApiProperty()
  cycle: string;

  @IsOptional()
  @ApiProperty()
  activeStatus: string;

  @IsOptional()
  @ApiProperty()
  alias: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  type: string;

  @IsOptional()
  @ApiProperty()
  price: number;

  @IsOptional()
  @ApiProperty()
  code: string;

  @IsOptional()
  @ApiProperty()
  joiningLink: string;

  @IsOptional()
  @ApiProperty()
  presenter: string;

  @IsOptional()
  @ApiProperty()
  programCoverPicl: string;

  @IsOptional()
  @ApiProperty({ default: 'active' })
  status: 'active' | 'inactive' | string;

  @IsOptional()
  @ApiProperty()
  timelinePics: string[];

  @IsOptional()
  @ApiProperty()
  ageGroup: object;

  @IsOptional()
  @ApiProperty({ type: date })
  date: date;

  @IsOptional()
  @ApiProperty({ default: false })
  isDateNotMention: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isPriceNotMention: boolean;

  @IsOptional()
  @ApiProperty({ type: time })
  time: time;

  @IsOptional()
  @ApiProperty({ default: false })
  isTimeNotMention: boolean;

  @IsOptional()
  @ApiProperty({ type: bookingCancelledIn })
  bookingCancelledIn: bookingCancelledIn;

  @IsOptional()
  @ApiProperty({ type: duration })
  duration: duration;

  @IsOptional()
  @ApiProperty({ default: false })
  isPublished: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isFree: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isFav: boolean;

  @IsOptional()
  @ApiProperty({ default: 0 })
  pricePerParticipant: number;

  @IsOptional()
  @ApiProperty()
  priceForSiblings: string;

  @IsOptional()
  @ApiProperty()
  specialInstructions: string;

  @IsOptional()
  @ApiProperty({ default: false })
  adultAssistanceIsRequried: boolean;

  @IsOptional()
  @ApiProperty({ type: pricePeriod })
  pricePeriod: pricePeriod;

  @IsOptional()
  @ApiProperty()
  priceUnit: string;

  @IsOptional()
  @ApiProperty({ type: capacity })
  capacity: capacity;

  @IsOptional()
  @ApiProperty()
  emails: string[];

  @IsOptional()
  @ApiProperty({ type: [batches] })
  batches: batches[];

  @IsOptional()
  @ApiProperty()
  user: string;

  @IsOptional()
  @ApiProperty()
  addresses: string[];

  @IsOptional()
  @ApiProperty({ type: [sessions] })
  sessions: sessions[];

  @IsOptional()
  @ApiProperty()
  programImage: string;

  @IsOptional()
  @ApiProperty()
  lastModifiedBy: string;

  @IsOptional()
  @ApiProperty({ type: days })
  days: days;

  @IsOptional()
  @ApiProperty()
  exceptionDates: string[];

  @IsOptional()
  @ApiProperty()
  extractionDate: Date;

  @IsOptional()
  @ApiProperty()
  extractor_notes: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  extractor_url: string;

  @IsOptional()
  @ApiProperty()
  proofreaderObservation: string;

  @IsOptional()
  @ApiProperty()
  extractionComment: string;

  @IsOptional()
  @ApiProperty()
  cyrilComment: string;

  @IsOptional()
  @ApiProperty()
  cyrilApproval: string;

  @IsOptional()
  @ApiProperty({ default: 0 })
  proofreaderRating: number;

  @IsOptional()
  @ApiProperty({ default: 0 })
  programRating: number;

  @IsOptional()
  @ApiProperty()
  dbStatus: string;

  @IsOptional()
  @ApiProperty()
  parentRequired: string;

  @IsOptional()
  @ApiProperty()
  sessionLength: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isExpired: boolean;

  @IsOptional()
  @ApiProperty()
  expireReason: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isproRated: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isFreeTrial: boolean;

  @IsOptional()
  @ApiProperty()
  per_hour_rate: string;

  @IsOptional()
  @ApiProperty({ default: 0 })
  cycle_time: number;

  @IsOptional()
  @ApiProperty()
  addedBy: string;

  @IsOptional()
  @ApiProperty()
  proof_reader_notes: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isParentJoin: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isChildCare: boolean;

  @IsOptional()
  @ApiProperty()
  privateOrGroup: string;

  @IsOptional()
  @ApiProperty({ default: 0 })
  maxTravelDistance: number;

  @IsOptional()
  @ApiProperty({ default: 0 })
  totalSessionClasses: number;

  @IsOptional()
  @ApiProperty()
  offerDiscount: string;

  @IsOptional()
  @ApiProperty({ default: false })
  isParentGuardianRequire: boolean;

  @IsOptional()
  @ApiProperty()
  isOpenForBooking: string;

  @IsOptional()
  @ApiProperty()
  zip: string;

  @IsOptional()
  @ApiProperty()
  last_reviewed: Date;

  @IsOptional()
  @ApiProperty()
  next_reviewed: Date;

  @IsOptional()
  @ApiProperty()
  addedByCreatedOn: Date;

  @IsOptional()
  @ApiProperty({ type: registrationDates })
  registrationDates: registrationDates;

  @IsOptional()
  @ApiProperty({ default: false })
  isDateFlexible: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isDayNotMention: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isDayFlexible: boolean;

  @IsOptional()
  @ApiProperty({ default: false })
  isTimeFlexible: boolean;

  @IsOptional()
  @ApiProperty()
  dateOption: string;

  @IsOptional()
  @ApiProperty()
  dayOption: string;

  @IsOptional()
  @ApiProperty()
  timeOption: string;

  @IsOptional()
  @ApiProperty()
  maxNumberOfStudents: string;

  @IsOptional()
  @ApiProperty()
  parentalSupervisionRequired: string;

  @IsOptional()
  @ApiProperty()
  pricing: string;

  @IsOptional()
  @ApiProperty({ type: pricePerUnit })
  pricePerUnit: pricePerUnit;

  @IsOptional()
  @ApiProperty()
  skillGroup: string;

  @IsOptional()
  @ApiProperty({ type: [questionAndAnswer] })
  questionAndAnswer: questionAndAnswer[];

  @IsOptional()
  @ApiProperty({ type: groupDiscount })
  groupDiscount: groupDiscount;

  @IsOptional()
  @ApiProperty()
  youEarn: string;

  @IsOptional()
  @ApiProperty({ type: meetGreetDuration })
  meetGreetDuration: meetGreetDuration;

  @IsOptional()
  @ApiProperty({ type: skillLevel })
  skillLevel: skillLevel;

  @IsOptional()
  @ApiProperty({ type: [extraPrices] })
  extraPrices: extraPrices[];

  @IsOptional()
  @ApiProperty({ type: [] })
  prices: any[];

  @IsOptional()
  @ApiProperty()
  providerEmail: string;

  @IsOptional()
  @ApiProperty()
  locationOfActivity: string;

  @IsOptional()
  @ApiProperty()
  multiLocations: Record<string, any>[];

  @IsOptional()
  @ApiProperty()
  instructor: Record<string, any>[];

  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @ApiProperty()
  schedule: string;

  @IsOptional()
  @ApiProperty()
  subCategoryIds: Record<string, any>[];

  @IsOptional()
  @ApiProperty()
  categoryId: Record<string, any>[];

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // providerId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  cityId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'purpleInvester'})
  addFrom: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  moveToWondrfly: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  isArchived: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  changeDetection?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  primaryPhoneNumbers: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  displayPhoneNumbers: string;
}

export interface programInterface {
  name?: string;
  providerName?: string;
  earlyDrop_off_LatePick_up?: object;
  canParentsParticipateInActivity?: boolean;
  // location?: {
  //   coordinates: [number, number];
  // };
  maxStudentsPerClass?: number;
  seatsAvailable?: number;
  activityRecurring?: {
    activityRecurring: boolean;
    days: string[];
  };
  indoorOroutdoor?: string;
  skillGroups?: string;
  inpersonOrVirtual?: string;
  source?: string;
  sourceUrl?: string;
  city?: string;
  cycle?: string;
  activeStatus?: string;
  alias?: string;
  description?: string;
  type?: string;
  price?: number;
  code?: string;
  joiningLink?: string;
  presenter?: string;
  programCoverPicl?: string;
  status?: 'active' | 'inactive' | string;
  isRequestVerified?: 'Not started'|'In review'|'Not approved'|'Approved'| string;
  timelinePics?: string[];
  ageGroup?: object;
  date?: {
    from: Date;
    to: Date;
  };
  isDateNotMention?: boolean;
  isPriceNotMention?: boolean;
  time?: {
    from: number;
    to: number;
  };
  isTimeNotMention?: boolean;
  bookingCancelledIn?: {
    days: string;
    hours: string;
  };
  duration?: {
    hours: string;
    minutes: string;
  };
  isPublished?: boolean;
  isFree?: boolean;
  isFav?: boolean;
  pricePerParticipant?: number;
  priceForSiblings?: string;
  specialInstructions?: string;
  adultAssistanceIsRequried?: boolean;
  pricePeriod?: {
    periodAmount: string;
    periodCount: number;
  };
  priceUnit?: string;
  capacity?: {
    min: number;
    max: number;
  };
  emails?: string[];
  batches?: {
    name: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    isFree: boolean;
    pricePerParticipant: string;
    instructor: string;
    numberOfSeats: string;
    location: string;
  }[];

  user?: string;
  addresses?: string[];
  sessions?: {
    sessionName?: string;
    sessionAddress?: string;
    sessionStartDate?: Date;
    sessionEndDate?: Date;
    sessionStartTime?: Date;
    sessionEndTime?: Date;
    noOfSeats?: string;
    instructor?: string;
  }[];
  programImage?: string;
  lastModifiedBy?: string;
  days?: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
  exceptionDates?: string[];
  extractionDate?: Date;
  extractor_notes?: string;
  extractor_url?: string;
  proofreaderObservation?: string;
  extractionComment?: string;
  cyrilComment?: string;
  cyrilApproval?: string;
  proofreaderRating?: number;
  programRating?: number;
  dbStatus?: string;
  parentRequired?: string;
  sessionLength?: string;
  isExpired?: boolean;
  expireReason?: string;
  isproRated?: boolean;
  isFreeTrial?: boolean;
  per_hour_rate?: string;
  cycle_time?: number;
  addedBy?: string;
  proof_reader_notes?: string;
  isParentJoin?: boolean;
  isChildCare?: boolean;
  privateOrGroup?: string;
  maxTravelDistance?: number;
  totalSessionClasses?: number;
  offerDiscount: string;
  isParentGuardianRequire: boolean;
  isOpenForBooking: string;
  zip: string;
  last_reviewed: Date;
  next_reviewed: Date;
  addedByCreatedOn: Date;
  registrationDates: {
    startDate: date;
    endDate: date;
  };
  isDateFlexible: boolean;
  isDayNotMention: boolean;
  isDayFlexible: boolean;
  isTimeFlexible: boolean;
  dateOption: string;
  dayOption: string;
  timeOption: string;
  maxNumberOfStudents: string;
  parentalSupervisionRequired: string;
  pricing: string;
  pricePerUnit: {
    unit: string;
    actualPrice: number;
  };
  skillGroup: string;
  questionAndAnswer: {
    question: string;
    answer1: string;
    answer2: string;
    other: string;
  }[];
  groupDiscount: {
    noOfStudents: number;
    discountPercent: string;
  };
  youEarn: string;
  meetGreetDuration: {
    hours: number;
    minutes: number;
  };
  skillLevel: {
    title: string;
    description: string;
    isCustom: boolean;
  };
  extraPrices: {
    pricePerUnit: string;
    pricePerParticipant: string;
    pricePerHour: string;
    classDuration: string;
    youEarn: string;
    noOfUnits: number;
    priceProrated: boolean;
    setDefault: boolean;
    additionalInfo: string;
  }[];
  providerEmail?: string;
  locationOfActivity?: string;
  multiLocations?: any[];
  prices?: any[];
  instructor?: any[];
  phoneNumber?: string;
  schedule?: string;
  subCategoryIds?: any[];
  categoryId?: any[];
  cityId?: string;
  providerId?: string;
  moveToWondrfly?: boolean;
  changeDetection?: boolean;
  addFrom?: string;
  isArchived?: boolean;
  displayPhoneNumbers?: string;
  primaryPhoneNumbers?: string;
  verifiedstatus: string = 'unverified' |
    'verified' |
    'declined' |
    'internal_proofreading' |
    'final_proofreading';
}

import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Dummyprogram {

  @Prop()
  name: string[];

  @Prop()
  description: string[];

  // @Prop({type: Object, default: {}})
  // prices: Record<string, any>;

  // @Prop({type: Object, default: {}})
  // schedule: Record<string, any>;

  // @Prop()
  // time: string;

  // @Prop()
  // type: string;

  // @Prop()
  // location: string;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'queue',
  //   required: false,
  // })
  // queue: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  })
  provider: string;

  // @Prop({ default: Date.now() })
  // createdOn: Date;

  // @Prop({ default: Date.now() })
  // updatedOn: Date;

    // @Prop()
    // name: string;
  
    @Prop()
    providerName: string;
  
    @Prop({ type: Object })
    earlyDrop_off_LatePick_up: object;
  
    @Prop({ default: false })
    canParentsParticipateInActivity: boolean;
  
    @Prop({ default: '' })
    maxStudentsPerClass: string;
  
    @Prop({ default: 0 })
    seatsAvailable: number;
  
    @Prop(
      raw({
        activityRecurring: { type: Boolean, default: false },
        days: [
          {
            type: String,
          },
        ],
      }),
    )
    activityRecurring: Record<string, any>;
  
    @Prop({ default: 'No data available' })
    indoorOroutdoor: string;
  
    @Prop({ default: 'No data available' })
    inpersonOrVirtual: string;
  
    @Prop()
    source: string;
  
    @Prop()
    sourceUrl: string;
  
    @Prop()
    city: string;
  
    @Prop()
    cycle: string;
  
    @Prop()
    activeStatus: string;
  
    @Prop()
    alias: string;
  
    // @Prop()
    // description: string;
  
    @Prop({ default: 'Single Session' })
    type: string;
  
    @Prop({ default: 0 })
    price: number;
  
    @Prop()
    code: string;
  
    @Prop()
    joiningLink: string;
  
    @Prop()
    presenter: string;
  
    @Prop()
    programCoverPicl: string;
  
    // @Prop(
    //   raw({
    //     coordinates: [
    //       {
    //         type: String,
    //       },
    //     ],
    //   }),
    // )
    // location: Record<string, any>;
  
    @Prop({ default: 'unverified' })
    verifiedstatus:
      | 'verified'
      | 'unverified'
      | 'declined'
      | 'internal_proofreading'
      | 'final_proofreading'
      | string;
  
    @Prop()
    status: 'active' | 'inactive' | string;
  
    @Prop()
    timelinePics: string[];
  
    // @Prop({
    //   minAge: { type: String, default: '' },
    //   maxAge: { type: String, default: '' }
    // })
    // ageGroup: Record<string, any>;

    @Prop(
      raw({
        minAge: { type: String, default: '' },
        maxAge: { type: String, default: '' },
      }),
    )
    ageGroup: Record<string, any>;
  
    @Prop(
      raw({
        from: { type: Date },
        to: { type: Date },
      }),
    )
    date: Record<string, any>;
  
    @Prop({ default: false })
    isDateNotMention: boolean;
  
    @Prop({ default: false })
    isPriceNotMention: boolean;
  
    @Prop()
    changeDetection: boolean;
  
    @Prop(
      raw({
        from: { type: String, default: '' },
        to: { type: String, default: '' },
      }),
    )
    time: Record<string, any>;
  
    @Prop({ default: false })
    isTimeNotMention: boolean;
  
    @Prop(
      raw({
        days: { type: String, default: '' },
        hours: { type: String, default: '' },
      }),
    )
    bookingCancelledIn: Record<string, any>;
  
    @Prop(
      raw({
        hours: { type: Number, default: '' },
        minutes: { type: Number, default: '' },
      }),
    )
    duration: Record<string, any>;
  
    @Prop({ default: true })
    isPublished: boolean;
  
    @Prop({ default: false })
    isFree: boolean;
  
    @Prop({ default: false })
    isFav: boolean;
  
    @Prop({ default: 0 })
    pricePerParticipant: number;
  
    @Prop()
    priceForSiblings: string;
  
    @Prop()
    specialInstructions: string;
  
    @Prop({ default: false })
    adultAssistanceIsRequried: boolean;
  
    @Prop(
      raw({
        periodAmount: { type: String, default: '' },
        periodCount: { type: Number, default: 0 },
      }),
    )
    pricePeriod: Record<string, any>;
  
    @Prop()
    priceUnit: string;
  
    @Prop(
      raw({
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
      }),
    )
    capacity: Record<string, any>;
  
    @Prop()
    emails: string[];
  
    // @Prop(
    //   raw([
    //     {
    //       name: { type: String, default: '' },
    //       startDate: { type: Date, default: '' },
    //       endDate: { type: Date, default: '' },
    //       startTime: { type: Date, default: '' },
    //       endTime: { type: Date, default: '' },
    //       isFree: { type: Boolean, default: false },
    //       pricePerParticipant: { type: String, default: '' },
    //       instructor: { type: String, default: '' },
    //       numberOfSeats: { type: String, default: '' },
    //       location: { type: String, default: '' },
    //     },
    //   ]),
    // )
    // batches: Record<string, any>;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
    user: string;
  
    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
    // providerId: string;
  
    @Prop({
      type: String,
      slug: 'name',
      unique: true,
      slugOn: {
        save: true,
        update: false,
        updateOne: false,
        updateMany: false,
        findOneAndUpdate: false,
      },
    })
    slug: string;
  
    @Prop()
    addresses: string[];

    @Prop()
    syncId: string;
  
    // @Prop(
    //   raw([
    //     {
    //       sessionName: { type: String, default: '' },
    //       sessionAddress: { type: String, default: '' },
    //       sessionStartDate: { type: Date, default: '' },
    //       sessionEndDate: { type: Date, default: '' },
    //       sessionStartTime: { type: Date, default: '' },
    //       sessionEndTime: { type: Date, default: '' },
    //       noOfSeats: { type: String, default: '' },
    //       instructor: { type: String, default: '' },
    //     },
    //   ]),
    // )
    // sessions: Record<string, any>;
  
    @Prop()
    programImage: string;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
    lastModifiedBy: string;
  
    @Prop(
      raw({
        sunday: { type: Boolean, default: false },
        monday: { type: Boolean, default: false },
        tuesday: { type: Boolean, default: false },
        wednesday: { type: Boolean, default: false },
        thursday: { type: Boolean, default: false },
        friday: { type: Boolean, default: false },
        saturday: { type: Boolean, default: false },
      }),
    )
    days: Record<string, any>;
  
    @Prop()
    exceptionDates: string[];
  
    @Prop()
    extractionDate: Date;
  
    @Prop()
    extractor_notes: string;
  
    @Prop()
    extractor_url: string;
  
    @Prop()
    proofreaderObservation: string;
  
    @Prop()
    extractionComment: string;
  
    @Prop()
    cyrilComment: string;
  
    @Prop()
    cyrilApproval: string;
  
    @Prop({ default: 0 })
    proofreaderRating: number;
  
    @Prop({ default: 0 })
    programRating: number;
  
    @Prop()
    dbStatus: string;
  
    @Prop()
    parentRequired: string;
  
    @Prop()
    sessionLength: string;

    @Prop()
    session_premises: string;
  
    @Prop({ default: false })
    isExpired: boolean;
  
    @Prop()
    expireReason: string;
  
    @Prop({ default: false })
    isproRated: boolean;
  
    @Prop({ default: false })
    isFreeTrial: boolean;
  
    @Prop()
    per_hour_rate: string;
  
    @Prop({ default: 0 })
    cycle_time: number;
  
    @Prop()
    proof_reader_notes: string;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
    addedBy: string;
  
    @Prop({ default: false })
    isParentJoin: boolean;
  
    @Prop({ default: false })
    isChildCare: boolean;
  
    @Prop({ default: 'Group' })
    privateOrGroup: string;
  
    @Prop({ default: 0 })
    maxTravelDistance: number;
  
    @Prop({ default: 0 })
    totalSessionClasses: number;
  
    @Prop()
    offerDiscount: string;
  
    @Prop({ default: false })
    isParentGuardianRequire: boolean;
  
    @Prop({ default: 'Yes' })
    isOpenForBooking: string;
  
    @Prop()
    zip: string;
  
    @Prop({ default: Date.now() })
    createdOn: Date;
  
    @Prop({ default: Date.now() })
    updatedOn: Date;
  
    @Prop({ default: '1970-06-28T12:32:06.247Z' })
    last_reviewed: Date;
  
    @Prop()
    next_reviewed: Date;
  
    @Prop()
    addedByCreatedOn: Date;
  
    @Prop(
      raw({
        startDate: { type: Date },
        endDate: { type: Date },
      }),
    )
    registrationDates: Record<string, any>;
  
    @Prop({ default: false })
    isDateFlexible: boolean;
  
    @Prop({ default: false })
    isDayNotMention: boolean;
  
    @Prop({ default: false })
    isDayFlexible: boolean;
  
    @Prop({ default: false })
    isTimeFlexible: boolean;
  
    @Prop({ default: 'Dates available' })
    dateOption: string;

    @Prop({ default: 'Dates available' })
    programType: string;
  
    @Prop({ default: 'Days provided' })
    dayOption: string;
  
    @Prop({ default: 'Time Available' })
    timeOption: string;
  
    @Prop({ default: 'No Capacity info' })
    maxNumberOfStudents: string;
  
    @Prop({ default: 'No data available' })
    parentalSupervisionRequired: string;
  
    // @Prop({default: {} })
    // pricing: Record<string, any>;
    @Prop({ type: Object })
    pricing: object;
    @Prop(
      raw({
        unit: { type: String, default: 'Price per class' },
        actualPrice: { type: Number, default: 0 },
      }),
    )
    pricePerUnit: Record<string, any>;
  
    @Prop()
    skillGroup: string[];
  
    @Prop(
      raw([
        {
          question: { type: String, default: '' },
          answer1: { type: String, default: '' },
          answer2: { type: String, default: '' },
          other: { type: String, default: '' },
        },
      ]),
    )
    questionAndAnswer: Record<string, any>;
  
    @Prop(
      raw({
        noOfStudents: { type: Number, default: 0 },
        discountPercent: { type: String, default: '' },
      }),
    )
    groupDiscount: Record<string, any>;
  
    @Prop()
    youEarn: string;
  
    @Prop(
      raw({
        hours: { type: Number, default: '' },
        minutes: { type: Number, default: '' },
      }),
    )
    meetGreetDuration: Record<string, any>;
  
    @Prop(
      raw({
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        isCustom: { type: Boolean, default: false },
      }),
    )
    skillLevel: Record<string, any>;
  
    @Prop(
      raw([
        {
          pricePerUnit: { type: String, default: '' },
          pricePerParticipant: { type: String, default: '' },
          pricePerHour: { type: String, default: '' },
          classDuration: { type: String, default: '' },
          youEarn: { type: String, default: '' },
          noOfUnits: { type: Number, default: 1 },
          priceProrated: { type: Boolean, default: false },
          setDefault: { type: Boolean, default: false },
          halfOrFullDay: { type: String, default: '' },
          title: { type: String, default: '' },
          isOngoing: { type: Boolean, default: false },
          pricePerClass: { type: String, default: '' },
          duration: { type: String, default: '' },
          noOfHours: { type: String, default: '' },
          candace: { type: String, default: '' },
          additionalInfo: { type: String, default: '' },
          durationType: { type: String, default: '' },
          addOnprices: { type: Array, default: [] },
        },
      ]),
    )
    extraPrices: Record<string, any>;

    // @Prop(
    //   raw([
    //     {
    //       name: { type: String, default: '' },
    //       day: { type: Array, default: [] },
    //       time: { type: String, default: '' },
    //     },
    //   ]),
    // )
    // schedule: Record<string, any>;
    @Prop({ type: Object })
    schedule: Record<string, any>;
  
    @Prop(
      raw([
        {
          priceUnit: { type: String, default: '' },
          priceType: { type: String, default: '' },
          pricePerParticipant: { type: String, default: '' },
          pricePerHour: { type: String, default: '' },
          classDuration: { type: String, default: '' },
          youEarn: { type: String, default: '' },
          noOfUnits: { type: String, default: '1' },
          priceProrated: { type: Boolean, default: false },
          setDefault: { type: Boolean, default: false },
          halfOrFullDay: { type: String, default: '' },
          title: { type: String, default: '' },
          recurrence: { type: String, default: '' },
          duration: { type: String, default: '' },
          noOfHours: { type: String, default: '' },
          noOfDays: { type: String, default: '' },
          addOnprices: { type: Array, default: [] },
          noOfWeeks: { type: String, default: '' },
          candace: { type: String, default: '' },
        },
      ]),
    )
    prices: Record<string, any>;
  
    @Prop({ default: false })
    isDuplicate: boolean;
  
    @Prop({ default: 'purpleInvester' })
    addFrom: string;

    @Prop({ })
    createFrom: string;
  
    @Prop({ default: false })
    moveToWondrfly: boolean;
  
    @Prop({ default: false })
    isArchived: boolean;
  
    @Prop()
    displayPhoneNumbers: string;
  
    @Prop({ default: 'Not started',
      Enum: ['Not started','In review','Not approved','Approved'], })
    isRequestVerified: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'category', required: false }])
    finalCategory: string[];
    
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'tag', required: false }])
    finalSubcategory: string[];
  }

export const DummyprogramSchema = SchemaFactory.createForClass(Dummyprogram);

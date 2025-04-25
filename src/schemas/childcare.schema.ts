import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Childcare {

    @Prop({ type: String, trim: true, required: true })
    name: string;
  
    @Prop({ type: String, default: '' })
    dob: string;
  
    @Prop({ type: String, default: '' })
    sex: string;
  
    @Prop({ type: String, default: '' })
    age: string;
  
    @Prop({ type: String, default: '' })
    avtar: string;
  
    @Prop({ type: String, default: '' })
    relationToChild: string;
  
    @Prop({ type: String, default: '' })
    contactOtherInfo: string;
  
    @Prop([{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
        required: false,
      }])
    interestInfo: string[];
  
    @Prop([{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
        required: false,
      }])
    top5InterestInfo: string[];
  
    @Prop({ type: String, default: '' })
    fromWhereYouHeard: string;
  
    @Prop({ type: String, default: '' })
    dislikes: string;
  
    @Prop({ type: String, default: '' })
    alergies: string;
  
    @Prop({ type: String, default: '' })
    parentNotes: string;
  
    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;
  
    @Prop({ type: Boolean, default: false })
    isKidDay: boolean;
  
    @Prop({ type: Boolean, default: false })
    isKidMonth: boolean;
  
    @Prop({ type: Boolean, default: false })
    isKidYear: boolean;
  
    @Prop({ type: String, default: '' })
    createdBy: string;
  
    @Prop({ type: String, default: '' })
    lastModifiedBy: string;
  
    @Prop({ type: String, default: '' })
    deletedBy: string;
  
    @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
    status: string;
  
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false,
      })
    parent: string;
  
    @Prop({ type: Boolean, default: true })
    isActivated: boolean;
  
    @Prop({
      type: {
        allergicToPeanuts: { type: Boolean, default: false },
        yourAnswer: { type: String, default: '' },
        saveForFutureBooking: { type: Boolean, default: false },
      },
    })
    isChildAllergicToPeanuts: {
      allergicToPeanuts: boolean;
      yourAnswer: string;
      saveForFutureBooking: boolean;
    };
  
    @Prop({ type: String, default: '' })
    gradeLevel: string;
  
    @Prop({
      type: {
        name: { type: String, default: '' },
        location: {
          type: { type: String, enum: ['Point'], default: 'Point' },
          coordinates: { type: [Number], default: [] },
        },
      },
    })
    schoolInfo: {
      name: string;
      location: { type: string; coordinates: number[] };
    };
  
    @Prop({
      type: {
        name: { type: String, default: '' },
        location: {
          type: { type: String, enum: ['Point'], default: 'Point' },
          coordinates: { type: [Number], default: [] },
        },
      },
    })
    churchInfo: {
      name: string;
      location: { type: string; coordinates: number[] };
    };
  
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false,
      })
    currentOrPreviousActivityproviders: string;
  
    @Prop({ type: Number, default: 0 })
    programCount: number;

  @Prop({ default: Date.now() })
  createdOn: Date;

  @Prop({ default: Date.now() })
  updatedOn: Date;
}

export const ChildcareSchema = SchemaFactory.createForClass(Childcare);
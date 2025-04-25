import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Programurl {
    @Prop({
        default: 'pending',
        Enum: ['pending', 'accepted', 'decline', 'processed'],
    })
    status: string;

    @Prop()
    url: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false,
    })
    userId: string;

    @Prop({ default: Date.now() })
    created_at: Date;

    @Prop({ default: Date.now() })
    updated_at: Date;

}

export const ProgramurlSchema = SchemaFactory.createForClass(Programurl);

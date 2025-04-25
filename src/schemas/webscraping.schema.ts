import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Webscraping {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'program',
        required: false,
    })
    programId: string;

    @Prop()
    content: string;

    @Prop()
    url: string;

    @Prop()
    isChanged: string;

    @Prop({ default: Date.now() })
    lastChangedTime: Date;
    
    @Prop({ default: Date.now() })
    created_at: Date;

    @Prop({ default: Date.now() })
    updated_at: Date;
}

export const WebscrapingSchema = SchemaFactory.createForClass(Webscraping);

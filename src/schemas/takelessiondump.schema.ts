import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Takelessiondump {
    // @Prop({
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'queue',
    //     required: false,
    // })
    // queue: string;

    // @Prop({
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: false,
    // })
    // provider: string;

    @Prop()
    content: string;

    @Prop()
    type: string;

    @Prop()
    modifiedBy: string;
    
    @Prop()
    source: string;
    @Prop()
    url: string;

    @Prop()
    isChanged: string;

    @Prop()
     website_images: string[];

    @Prop({ default: Date.now() })
    lastChangedTime: Date;
    
    @Prop({ default: Date.now() })
    created_at: Date;

    @Prop({ default: Date.now() })
    updated_at: Date;
}

export const TakelessiondumpSchema = SchemaFactory.createForClass(Takelessiondump);

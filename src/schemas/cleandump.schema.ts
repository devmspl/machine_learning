import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Cleandump {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queue',
        required: false,
    })
    queue: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'webdump',
        required: false,
    })
    dumpId: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false,
    })
    provider: string;

    @Prop({ type: mongoose.Schema.Types.Mixed  })
    content: string | object;

    @Prop()
    url: string;

    @Prop()
    source: string;

    @Prop()
    isChanged: string;

    @Prop({ default: false })
    isprovider: boolean;

    @Prop({ default: false })
    isProviderDataAvailable: boolean;

    @Prop({ default: false })
    isProgramDataAvailable: boolean;

    @Prop({ default: false })
    dummyProgram: boolean;

    @Prop({ default: false })
    chatgpt: boolean;

    @Prop({ default: false })
    gemini: boolean;

    @Prop({ type: Object, default: {} })
    provider_data: Record<string, any>;

    @Prop({ type: Object, default: {} })
    program_data: Record<string, any>;

    @Prop()
    filter_detail: string[];

    @Prop({ default: Date.now() })
    lastChangedTime: Date;
    
    @Prop({ default: Date.now() })
    created_at: Date;

    @Prop({ default: Date.now() })
    updated_at: Date;
}

export const CleandumpSchema = SchemaFactory.createForClass(Cleandump);

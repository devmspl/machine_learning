import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class ScriptLogs {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'citymanagement',
        required: false,
    })
    cityId: string;
    
    @Prop({ default: Date.now() })
    startAt: Date;

    @Prop({default: ''})
    endAt: Date;

    @Prop({ default: '', type: String })
    name: string;

    @Prop({ default: '', type: String })
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false })
    startedBy: string;

}

export const ScriptLogsSchema = SchemaFactory.createForClass(ScriptLogs);

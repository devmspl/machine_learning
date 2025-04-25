import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps:true})
export class Allschoolprogramdump {

    @Prop()
    providerUrl: string;

    @Prop()
    programurl: string;

    @Prop()
    content: string;
        
    @Prop({ default: Date.now() })
    created_at: Date;

    @Prop({ default: Date.now() })
    updated_at: Date;
}

export const AllschoolprogramdumpSchema = SchemaFactory.createForClass(Allschoolprogramdump);

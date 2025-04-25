import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  gender: 'male' | 'female';

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop({ required: true })
  roles: 'superadmin' | 'admin' | 'mturkers' | string;

  @Prop({ required: true })
  password: string;

  @Prop(
    raw({
      coordinates: [
        {
          type: String,
        },
      ],
    }),
  )
  location: Record<string, any>;

  @Prop()
  token: string;

  @Prop()
  device_token: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });

UserSchema.index({ phone_number: 1, phone_code: 1 });

import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

export class User extends defaultClasses.TimeStamps {
  @prop({ required: true })
  @IsString()
  @Length(2, 100)
  name!: string;

  @prop({ required: true })
  @IsEmail()
  email!: string;
  @prop()
  password: string;
  @prop({ required: true })
  @IsBoolean()
  admin!: boolean;
}

export const userModel = getModelForClass(User);

export const userSchema = {
  name: { type: 'string', required: true, example: 'Gary Forster' },
  email: {
    type: 'string',
    required: true,
    example: 'gary@garyforster.io',
  },
  admin: {
    type: 'boolean',
    required: true,
    example: false,
  },
};

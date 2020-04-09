import { getModelForClass, prop } from '@typegoose/typegoose';
import { IsEmail, Length } from 'class-validator';

export class User {
  @prop({ required: true })
  @Length(2, 100)
  name!: string;

  @prop({ required: true })
  @IsEmail()
  email!: string;
}

export const userModel = getModelForClass(User);

export const userSchema = {
  name: { type: 'string', required: true, example: 'Gary Forster' },
  email: {
    type: 'string',
    required: true,
    example: 'gary@garyforster.io',
  },
};

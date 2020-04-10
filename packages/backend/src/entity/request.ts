import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { IsBoolean, IsString, Length } from 'class-validator';

export class Request extends defaultClasses.TimeStamps {
  @prop({ required: true })
  @IsBoolean()
  completed?: boolean;
  @prop({ required: true })
  @IsString()
  @Length(24, 24)
  evaluatorId!: string;
  @prop({ required: true })
  @IsString()
  @Length(24, 24)
  evaluateeId!: string;
}

export const requestModel = getModelForClass(Request);

export const requestSchema = {
  evaluatorId: {
    type: 'string',
    required: true,
    example: '5e8eedfc5d44c4799f027663',
  },
  evaluateeId: {
    type: 'string',
    required: true,
    example: '5e8ef605ad56d0254632ca7c',
  },
};

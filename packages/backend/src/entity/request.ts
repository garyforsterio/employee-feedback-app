import { getModelForClass, prop } from '@typegoose/typegoose';
import { Length } from 'class-validator';

export class Request {
  @prop({ required: true })
  completed?: boolean;
  @prop({ required: true })
  @Length(24, 24)
  evaluatorId!: string;
  @prop({ required: true })
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

import {
  defaultClasses,
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import { Review } from './review';
import { User } from './user';

export class Request extends defaultClasses.TimeStamps {
  @prop({ required: true })
  @IsBoolean()
  completed?: boolean;

  @prop({ required: true, ref: User })
  @IsString()
  @Length(24, 24)
  evaluatorId!: Ref<User>;

  @prop({ required: true, ref: User })
  @IsString()
  @Length(24, 24)
  evaluateeId!: Ref<User>;

  @prop({ ref: Review })
  reviewId?: Ref<Review>;
}

export class QueryParams {
  @IsString()
  @IsOptional()
  @Length(24, 24)
  evaluatorId?: string;
  @IsString()
  @IsOptional()
  @Length(24, 24)
  evaluateeId?: string;
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export const queryParamsSchema = {
  evaluateeId: {
    type: 'string',
    required: false,
    description: 'Limit requests to a single individual to be evaluated',
  },
  evaluatorId: {
    type: 'string',
    required: false,
    description:
      'Limit requests to a single individual to complete evalutation',
  },
  completed: {
    type: 'string',
    required: false,
    description: 'Limit requests to whether they have been completed or not',
  },
};

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

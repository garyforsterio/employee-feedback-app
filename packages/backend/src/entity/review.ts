import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class Review extends defaultClasses.TimeStamps {
  @prop({ required: true })
  @Min(0)
  @Max(5)
  rating!: number;

  @prop()
  @IsString()
  @IsOptional()
  @Length(0, 5000)
  feedback!: string;
}

export const reviewModel = getModelForClass(Review);

export const reviewSchema = {
  requestId: {
    type: 'string',
    required: true,
    example: '5e8eedfc5d44c4799f027663',
  },
  rating: { type: 'integer', required: true, example: 4 },
  feedback: {
    type: 'string',
    required: true,
    example: 'Generally a good person',
  },
};

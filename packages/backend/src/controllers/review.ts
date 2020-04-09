import { validate, ValidationError } from 'class-validator';
import { BaseContext } from 'koa';
import {
  body,
  path,
  request,
  responses,
  responsesAll,
  summary,
  tagsAll,
} from 'koa-swagger-decorator';

import { requestModel } from '../entity/request';
import { Review, reviewModel, reviewSchema } from '../entity/review';

const NO_REVIEW_FOUND = 'The associated review could not be found';
const NO_REQUEST_MADE = 'No such request has been made for evaluation';

@responsesAll({
  200: { description: 'Success' },
  201: { description: 'Created' },
  400: { description: 'Bad request' },
  401: { description: 'Unauthorized, missing/wrong JWT' },
})
@tagsAll(['Review'])
export default class ReviewController {
  @request('get', '/reviews')
  @summary('Get all reviews')
  public static async getReviews(ctx: BaseContext): Promise<void> {
    const reviews = await reviewModel.find({}, '-__v').lean();

    ctx.status = 200;
    ctx.body = reviews;
  }

  @request('get', '/reviews/{id}')
  @summary('Get review by id')
  @path({
    id: { type: 'string', required: true, description: 'ID of the review' },
  })
  public static async getReview(ctx: BaseContext): Promise<void> {
    const review = await reviewModel.findById(ctx.params.id, '-__v');

    if (!review) {
      ctx.status = 400;
      ctx.body = NO_REVIEW_FOUND;
      return;
    }

    ctx.status = 200;
    ctx.body = review;
  }

  @request('post', '/reviews')
  @responses()
  @summary('Create a review')
  @body(reviewSchema)
  public static async createReview(ctx: BaseContext): Promise<void> {
    // Build up new review to be saved
    const newReview: Review = new Review();
    newReview.requestId = ctx.request.body.requestId;
    newReview.rating = ctx.request.body.rating;
    newReview.feedback = ctx.request.body.feedback;

    // Validate
    const errors: ValidationError[] = await validate(newReview);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const request = await requestModel.findById(newReview.requestId);

    if (!request) {
      ctx.status = 400;
      ctx.body = NO_REQUEST_MADE;
      return;
    }

    // Create
    const review = (await reviewModel.create(newReview)).toJSON();

    // Set request to completed
    request.completed = true;
    await request.save();

    delete review.__v;

    ctx.status = 201;
    ctx.body = review;
  }
}

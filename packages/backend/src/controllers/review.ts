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
import { userModel } from './../entity/user';

const NO_REVIEW_FOUND = 'The associated review could not be found';
const NO_REQUEST_MADE = 'No such request has been made for evaluation';

const REVIEW_MAX_VALUE = 5;

@responsesAll({
  200: { description: 'Success' },
  201: { description: 'Created' },
  400: { description: 'Bad request' },
  401: { description: 'Unauthorized, missing/wrong JWT' },
})
@tagsAll(['Review'])
export default class ReviewController {
  @request('get', '/api/reviews')
  @summary('Get all reviews')
  public static async getReviews(ctx: BaseContext): Promise<void> {
    // Admins only
    if (!ctx.state.user.admin) {
      ctx.status = 403;
      return;
    }

    const reviews = await reviewModel.find({}, '-__v').lean();

    ctx.status = 200;
    ctx.body = reviews;
  }

  @request('get', '/api/reviews/{id}')
  @summary('Get review by id')
  @path({
    id: { type: 'string', required: true, description: 'ID of the review' },
  })
  public static async getReview(ctx: BaseContext): Promise<void> {
    // Admins only
    if (!ctx.state.user.admin) {
      ctx.status = 403;
      return;
    }

    const review = await reviewModel.findById(ctx.params.id, '-__v');

    if (!review) {
      ctx.status = 400;
      ctx.body = NO_REVIEW_FOUND;
      return;
    }

    ctx.status = 200;
    ctx.body = review;
  }

  @request('post', '/api/reviews')
  @responses()
  @summary('Create a review')
  @body(reviewSchema)
  public static async createReview(ctx: BaseContext): Promise<void> {
    // Build up new review to be saved
    const newReview: Review = new Review();
    newReview.rating = ctx.request.body.rating;
    newReview.feedback = ctx.request.body.feedback;

    // Validate
    const errors: ValidationError[] = await validate(newReview);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const request = await requestModel.findById(ctx.request.body.requestId);

    if (!request) {
      ctx.status = 400;
      ctx.body = NO_REQUEST_MADE;
      return;
    }

    // Create
    const review = await reviewModel.create(newReview);

    // Set request to completed and add review id
    request.completed = true;
    request.reviewId = review._id;
    await request.save();

    // Update user rating
    const requests = await requestModel
      .find({
        evaluateeId: request.evaluateeId,
        completed: true,
      })
      .populate('reviewId');

    const averageRating =
      requests.reduce((sum, request) => {
        return (sum += (request.reviewId as Review).rating);
      }, 0) /
      (REVIEW_MAX_VALUE * requests.length);

    await userModel.findByIdAndUpdate(request.evaluateeId, {
      averageRating: averageRating.toFixed(4),
    });

    delete review.__v;

    ctx.status = 201;
    ctx.body = review;
  }
}

import { validate, ValidationError } from 'class-validator';
import { BaseContext } from 'koa';
import {
  body,
  path,
  query,
  request,
  responses,
  responsesAll,
  summary,
  tagsAll,
} from 'koa-swagger-decorator';

import {
  QueryParams,
  queryParamsSchema,
  Request,
  requestModel,
  requestSchema,
} from '../entity/request';

const NO_REQUEST_FOUND = 'The associated request could not be found';
const DUPLICATE_REQUEST = 'The specified request has already been made';

@responsesAll({
  200: { description: 'Success' },
  201: { description: 'Created' },
  400: { description: 'Bad request' },
  401: { description: 'Unauthorized, missing/wrong JWT' },
})
@tagsAll(['Request'])
export default class RequestController {
  @request('get', '/api/requests')
  @summary('Get all requests')
  @query(queryParamsSchema)
  public static async getRequests(ctx: BaseContext): Promise<void> {
    // Get query params
    const query = Object.entries(ctx.query).reduce(
      (
        query,
        [key, value]: ['evaluatorId' | 'evaluateeId' | 'completed', string],
      ) => {
        // Cast completed value to bool
        if (key === 'completed') {
          query[key] = value === 'false' ? false : true;
        } else {
          query[key] = value;
        }
        return query;
      },
      new QueryParams(),
    );

    // Validate
    const errors: ValidationError[] = await validate(query);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const requests = await requestModel.find(query, '-__v').lean();

    ctx.status = 200;
    ctx.body = requests;
  }

  @request('get', '/api/requests/{id}')
  @summary('Get request by id')
  @path({
    id: { type: 'string', required: true, description: 'ID of the request' },
  })
  public static async getRequest(ctx: BaseContext): Promise<void> {
    const request = await requestModel.findById(ctx.params.id, '-__v');

    if (!request) {
      ctx.status = 400;
      ctx.body = NO_REQUEST_FOUND;
      return;
    }

    ctx.status = 200;
    ctx.body = request;
  }

  @request('post', '/api/requests')
  @responses()
  @summary('Create a request')
  @body(requestSchema)
  public static async createRequest(ctx: BaseContext): Promise<void> {
    // Admins only
    if (!ctx.state.user.admin) {
      ctx.status = 403;
      return;
    }

    // Build up new request to be saved
    const newRequest: Request = new Request();
    newRequest.evaluateeId = ctx.request.body.evaluateeId;
    newRequest.evaluatorId = ctx.request.body.evaluatorId;
    newRequest.completed = false;

    // Validate
    const errors: ValidationError[] = await validate(newRequest);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const preexistingRequest = await requestModel.findOne(newRequest);

    if (preexistingRequest) {
      ctx.status = 400;
      ctx.body = DUPLICATE_REQUEST;
      return;
    }

    // Create
    const request = (await requestModel.create(newRequest)).toJSON();

    delete request.__v;

    ctx.status = 201;
    ctx.body = request;
  }

  @request('delete', '/api/requests/{id}')
  @summary('Delete request by id')
  @path({
    id: { type: 'string', required: true, description: 'ID of the request' },
  })
  public static async deleteRequest(ctx: BaseContext): Promise<void> {
    // Admins only
    if (!ctx.state.user.admin) {
      ctx.status = 403;
      return;
    }

    const requestToRemove = await requestModel.findById(ctx.params.id);

    if (!requestToRemove) {
      ctx.status = 400;
      ctx.body = NO_REQUEST_FOUND;
      return;
    }

    await requestToRemove.remove();

    ctx.status = 200;
  }
}

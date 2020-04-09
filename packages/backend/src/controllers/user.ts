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
import mongoose from 'mongoose';

import { User, userModel, userSchema } from '../entity/user';

const NO_USER_FOUND = 'The associated user could not be found';
const DUPLICATE_EMAIL_ADDRESS = 'The specified email address is already in use';

@responsesAll({
  200: { description: 'Success' },
  201: { description: 'Created' },
  400: { description: 'Bad request' },
  401: { description: 'Unauthorized, missing/wrong JWT' },
})
@tagsAll(['User'])
export default class UserController {
  @request('get', '/users')
  @summary('Get all users')
  public static async getUsers(ctx: BaseContext): Promise<void> {
    const users = await userModel.find({}, '-__v').lean();

    ctx.status = 200;
    ctx.body = users;
  }

  @request('get', '/users/{id}')
  @summary('Get user by id')
  @path({
    id: { type: 'string', required: true, description: 'ID of the user' },
  })
  public static async getUser(ctx: BaseContext): Promise<void> {
    const user = await userModel.findById(ctx.params.id, '-__v');

    if (!user) {
      ctx.status = 400;
      ctx.body = NO_USER_FOUND;
      return;
    }

    ctx.status = 200;
    ctx.body = user;
  }

  @request('post', '/users')
  @responses()
  @summary('Create a user')
  @body(userSchema)
  public static async createUser(ctx: BaseContext): Promise<void> {
    // Build up new user to be saved
    const newUser: User = new User();
    newUser.name = ctx.request.body.name;
    newUser.email = ctx.request.body.email;

    // Validate user
    const errors: ValidationError[] = await validate(newUser);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const preexistingUser = await userModel.findOne({ email: newUser.email });

    if (preexistingUser) {
      ctx.status = 400;
      ctx.body = DUPLICATE_EMAIL_ADDRESS;
      return;
    }

    // Create user
    const user = (await userModel.create(newUser)).toJSON();

    delete user.__v;

    ctx.status = 201;
    ctx.body = user;
  }

  @request('put', '/users/{id}')
  @summary('Update a user')
  @path({
    id: { type: 'string', required: true, description: 'ID of the user' },
  })
  @body(userSchema)
  public static async updateUser(ctx: BaseContext): Promise<void> {
    const updatedUser: User = new User();
    updatedUser.name = ctx.request.body.name;
    updatedUser.email = ctx.request.body.email;

    // validate user entity
    const errors: ValidationError[] = await validate(updatedUser);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }
    const preexistingUser = await userModel.findById(ctx.params.id);

    if (!preexistingUser) {
      ctx.status = 400;
      ctx.body = NO_USER_FOUND;
      return;
    }

    const duplicateUser = await userModel.findOne({
      email: updatedUser.email,
      _id: { $ne: new mongoose.mongo.ObjectId(ctx.params.id) },
    });

    if (duplicateUser) {
      ctx.status = 400;
      ctx.body = DUPLICATE_EMAIL_ADDRESS;
      return;
    }

    await preexistingUser.update(updatedUser);

    ctx.status = 200;
    ctx.body = updatedUser;
  }

  @request('delete', '/users/{id}')
  @summary('Delete user by id')
  @path({
    id: { type: 'string', required: true, description: 'ID of the user' },
  })
  public static async deleteUser(ctx: BaseContext): Promise<void> {
    const userToRemove = await userModel.findById(ctx.params.id);

    if (!userToRemove) {
      ctx.status = 400;
      ctx.body = NO_USER_FOUND;
      return;
    }

    await userToRemove.remove();

    ctx.status = 200;
  }
}

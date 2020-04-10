import { DocumentType } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BaseContext } from 'koa';
import {
  body,
  request,
  responsesAll,
  summary,
  tagsAll,
} from 'koa-swagger-decorator';

import config from '../config';
import { User, userModel } from '../entity/user';

const saltRounds = 10;

const REQUEST_ADDITION =
  'Please request your administrator to first add you to the system';
const ALREADY_REGISTERED = 'An account already exists for that email address';
const INCORRECT_PASSWORD = 'Incorrect password';
const INVALID_PASSWORD =
  'Password is invalid. Please make sure it is over 6 characters long';

// Swagger login schema
export const loginSchema = {
  email: {
    type: 'string',
    required: true,
    example: 'gary@garyforster.io',
  },
  password: {
    type: 'string',
    required: true,
    example: 'a_[lmWZUY)K5>lTU',
  },
};

/**
 * Get JWT
 */
function getToken(user: DocumentType<User>): string {
  const payload = {
    user: {
      id: user._id,
      admin: user.admin,
    },
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
  });
}

@responsesAll({
  200: { description: 'Success' },
  400: { description: 'Bad request' },
})
@tagsAll(['Auth'])
export default class AuthController {
  @request('post', '/register')
  @summary(
    'Register for an account given that you have been added to the system by admin',
  )
  @body(loginSchema)
  public static async register(ctx: BaseContext): Promise<void> {
    const user = await userModel.findOne({ email: ctx.request.body.email });

    if (!user) {
      ctx.status = 400;
      ctx.body = REQUEST_ADDITION;
      return;
    }

    if (user.password) {
      ctx.status = 400;
      ctx.body = ALREADY_REGISTERED;
    }
    const proposedPassword: string = ctx.request.body.password;
    // TODO: further password validation
    if (proposedPassword.length < 6) {
      ctx.status = 400;
      ctx.body = INVALID_PASSWORD;
    }

    // Hash password
    user.password = await bcrypt.hash(ctx.request.body.password, saltRounds);

    await user.save();

    ctx.status = 200;
    ctx.body = {
      token: getToken(user),
    };
  }

  @request('post', '/login')
  @summary('Login to an account')
  @body(loginSchema)
  public static async login(ctx: BaseContext): Promise<void> {
    const user = await userModel.findOne({ email: ctx.request.body.email });

    if (!user || !user.password) {
      ctx.status = 400;
      ctx.body = REQUEST_ADDITION;
      return;
    }

    const isMatch = bcrypt.compareSync(
      ctx.request.body.password,
      user.password,
    );

    if (!isMatch) {
      ctx.status = 400;
      ctx.body = INCORRECT_PASSWORD;
      return;
    }

    ctx.status = 200;
    ctx.body = { token: getToken(user) };
  }
}

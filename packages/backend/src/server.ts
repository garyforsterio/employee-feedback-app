import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import logger from 'koa-logger';
import mongoose from 'mongoose';

import config from './config';
import router from './routes';

// Connect to database
mongoose
  .connect(`mongodb://${config.dbHost}:${config.dbPort}/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config.dbName,
  })
  .then(() => {
    console.log('Database connected. Initializing app...');

    const app = new Koa();

    // Provides important headers for security
    app.use(helmet());

    // Enable cors
    app.use(cors());

    // Logger middleware
    app.use(logger());

    // Enable bodyParser
    app.use(bodyParser());

    // JWT middleware
    // Anything below is unauthorized if JWT token is invalid
    // Exclude swagger endpoints
    app.use(
      jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }),
    );

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(config.port);

    console.log(`Server running on port ${config.port}`);
  });

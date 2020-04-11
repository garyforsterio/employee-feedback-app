import { SwaggerRouter } from 'koa-swagger-decorator';

import { auth } from './controllers';

const router = new SwaggerRouter();

// Auth routes
router.map(auth, {});

// Swagger endpoint
router.swagger({
  title: 'Feedback backend',
  description: 'Public REST API for authenticating',
  version: '1.0.0',
  swaggerHtmlEndpoint: '/api/docs',
  swaggerJsonEndpoint: '/api/docs-json',
});

export default router;

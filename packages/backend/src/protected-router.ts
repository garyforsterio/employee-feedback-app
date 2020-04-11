import { SwaggerRouter } from 'koa-swagger-decorator';

import { request, review, user } from './controllers';

const router = new SwaggerRouter();

// User
router.map(user, {});

// Request
router.map(request, {});

// Review
router.map(review, {});

// Swagger endpoint
router.swagger({
  title: 'Feedback backend - Protected',
  description:
    'Protected REST API for obtaining, requesting, and creating employee feedback',
  version: '1.0.0',
  swaggerHtmlEndpoint: '/api/docs-protected',
  swaggerJsonEndpoint: '/api/docs-protected-json',
});

export default router;

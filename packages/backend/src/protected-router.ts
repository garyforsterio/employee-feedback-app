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
    'REST API for obtaining, requesting, and creating employee feedback',
  version: '1.0.0',
  swaggerHtmlEndpoint: '/swagger-protected-html',
  swaggerJsonEndpoint: '/swagger-protected-json',
});

export default router;

import { SwaggerRouter } from 'koa-swagger-decorator';

import { auth } from './controllers';

const router = new SwaggerRouter();

// Auth routes
router.map(auth, {});

// Swagger endpoint
router.swagger({
  title: 'Feedback backend',
  description:
    'REST API for obtaining, requesting, and creating employee feedback',
  version: '1.0.0',
});

export default router;

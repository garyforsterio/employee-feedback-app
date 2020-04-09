import { SwaggerRouter } from 'koa-swagger-decorator';

import { request, review, user } from './controllers';

const router = new SwaggerRouter();

// User routes
router.get('/users', user.getUsers);
router.get('/users/:id', user.getUser);
router.post('/users', user.createUser);
router.put('/users/:id', user.updateUser);
router.delete('/users/:id', user.deleteUser);

// Request routes
router.get('/requests', request.getRequests);
router.get('/requests/:id', request.getRequest);
router.post('/requests', request.createRequest);
router.delete('/requests/:id', request.deleteRequest);

// Review routes
router.get('/reviews', review.getReviews);
router.get('/reviews/:id', review.getReview);
router.post('/reviews', review.createReview);

// Swagger endpoint
router.swagger({
  title: 'Feedback backend',
  description:
    'REST API for obtaining, requesting, and creating employee feedback',
  version: '1.0.0',
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(__dirname);

export default router;

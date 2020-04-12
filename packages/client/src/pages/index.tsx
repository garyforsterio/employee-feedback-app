import React, { FunctionComponent } from 'react';
import { Redirect, Router } from '@reach/router';

import CreateUser from '@/components/create-user';
import FeedbackList from '@/components/feedback-list';
import Login from '@/components/login';
import PrivateRoute from '@/components/private-route';
import Users from '@/components/users';

/**
 * Root page which hosts SPA for the following routes
 * In the future, additional pages which do not require authentication can be added to this folder
 */
const IndexPage: FunctionComponent = () => {
  return (
    <Router>
      <Login isRegistration={false} path="/login" />
      <Login isRegistration={true} path="/register" />
      <PrivateRoute component={FeedbackList} path="/feedback" />
      <PrivateRoute component={Users} path="/users" />
      <PrivateRoute component={CreateUser} path="/users/create" />
      <PrivateRoute component={CreateUser} path="/users/:userId" />
      <Redirect from="*" noThrow to="/feedback/" />
    </Router>
  );
};

export default IndexPage;

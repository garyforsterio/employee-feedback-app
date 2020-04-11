import React, { FunctionComponent } from 'react';
import { Redirect, Router } from '@reach/router';

import CreateUser from '@/components/create-user';
import Login from '@/components/login';
import PrivateRoute from '@/components/private-route';
import Users from '@/components/users';

const IndexPage: FunctionComponent = () => {
  return (
    <Router>
      <Login isRegistration={false} path="/login" />
      <Login isRegistration={true} path="/register" />
      <PrivateRoute component={Users} path="/users" />
      <PrivateRoute component={CreateUser} path="/users/create" />
      <PrivateRoute component={CreateUser} path="/users/:userId" />
      <Redirect from="/" noThrow to="/users/" />
    </Router>
  );
};

export default IndexPage;

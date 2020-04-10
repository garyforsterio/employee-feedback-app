import React from 'react';
import { navigate } from 'gatsby';

import { useAuth } from '../providers/auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    navigate('/login/');
    return null;
  }
  return <Component {...rest} />;
};
export default PrivateRoute;

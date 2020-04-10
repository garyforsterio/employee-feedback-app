import React, { FunctionComponent } from 'react';

import Login from '@/components/login';

const IndexPage: FunctionComponent = () => {
  return <Login isRegistration={false} />;
};

export default IndexPage;
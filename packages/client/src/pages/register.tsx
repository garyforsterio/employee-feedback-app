import React, { FunctionComponent } from 'react';

import Login from '@/components/login';

const IndexPage: FunctionComponent = () => {
  return <Login isRegistration={true} />;
};

export default IndexPage;

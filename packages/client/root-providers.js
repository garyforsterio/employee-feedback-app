import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import AuthProvider from './src/providers/auth';

/**
 * Used by both Gatsby's SSR API and browser API
 * Root providers which are applied to all pages
 * Nomralize css and provide auth
 */
const providers = ({ element }) => (
  <CssBaseline>
    <AuthProvider>{element}</AuthProvider>
  </CssBaseline>
);

export default providers;

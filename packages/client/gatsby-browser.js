import React, { Suspense } from 'react';

import providers from './root-providers';

import './src/services/i18n';

/**
 * Wrap page in suspense for loading language locales
 */
/** @type {import('gatsby').GatsbyBrowser['wrapPageElement']} */
export const wrapPageElement = ({ element }) => (
  <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
);

/**
 * Reload page automatically on updates to service worker
 */
/** @type {import('gatsby').GatsbyBrowser['onServiceWorkerUpdateReady']} */
export const onServiceWorkerUpdateReady = () => {
  window.location.reload();
};

/** @type {import('gatsby').GatsbyBrowser['wrapRootElement']} */
export const wrapRootElement = providers;

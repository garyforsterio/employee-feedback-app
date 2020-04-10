import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return <div>{t('404.message')}</div>;
};
export default NotFoundPage;

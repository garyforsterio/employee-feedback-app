import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// TODO: Enable when multiple languages required
// import detector from "i18next-browser-languagedetector";
// import backend from "i18next-xhr-backend";
import en from '../../static/locales/en/translation.json';

i18n
  // TODO: Enable when multiple languages required
  //   .use(detector)
  //   .use(backend)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
    },
    lng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: '/locale/{{lng}}/common.json',
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: require('./public/locale/en/common.json'),
      },
      zh: {
        translation: require('./public/locale/zh/common.json'),
      },
      uk: {
        translation: require('./public/locale/uk/common.json'),
      },
    },
  });
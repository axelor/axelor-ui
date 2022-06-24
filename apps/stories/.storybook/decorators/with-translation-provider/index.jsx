import React from 'react';
import i18next from 'i18next';
import {
  initReactI18next,
  I18nextProvider,
  useTranslation,
} from 'react-i18next';
import { useEffect } from '@storybook/addons';

import en_US from './locales/en_US/translations.json';
import ar_MA from './locales/ar_MA/translations.json';

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  lng: 'en_US',
  fallbackLng: 'en_US',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en_US: {
      translation: en_US,
    },
    ar_MA: {
      translation: ar_MA,
    },
  },
});

export const WithUseTranslation = (Story, context) => {
  const { t } = useTranslation();

  return <Story {...{ ...context, args: { ...context.args, t } }} />;
};

export const WithTranslationProvider = (Story, context) => {
  const { locale } = context.globals;

  useEffect(() => {
    locale && i18n?.changeLanguage(locale);
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      {WithUseTranslation(Story, context)}
    </I18nextProvider>
  );
};

export default WithTranslationProvider;

import i18next from "i18next";
import React, { useEffect } from "react";
import { Decorator } from "@storybook/react";
import { I18nextProvider, initReactI18next } from "react-i18next";

import { ThemeProvider } from "../../../src/core";

import ar_MA from "./locales/ar_MA/translations.json";
import en_US from "./locales/en_US/translations.json";

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  lng: "en_US",
  fallbackLng: "en_US",
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

export const WithTheme: Decorator = (Story, context) => {
  const { locale, theme } = context.globals;
  const dir = locale && locale === "ar_MA" ? "rtl" : "ltr";

  useEffect(() => {
    if (locale) i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider dir={dir} theme={theme}>
        {Story(context)}
      </ThemeProvider>
    </I18nextProvider>
  );
};

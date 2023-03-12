import { WithTheme } from "./decorators/with-theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        "System",
        "Layout",
        "Animation",
        "Core",
        "Icons",
        "Components",
        "Advanced",
      ],
    },
  },
};

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Global locale for components",
    defaultValue: "en_US",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en_US", title: "English" },
        { value: "ar_MA", title: "العربية" },
      ],
    },
  },
};

export const decorators = [WithTheme];

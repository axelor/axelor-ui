import type { Preview } from "@storybook/react";
import { WithTheme } from "./decorators/with-theme";

const preview: Preview = {
  parameters: {
    actions: {},
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
  },
  globalTypes: {
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
    theme: {
      name: "Theme",
      description: "Theme",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "Light" },
          { value: "dark", icon: "circle", title: "Dark" },
        ],
      },
    },
  },
  decorators: [WithTheme],
  tags: ["autodocs"],
};

export default preview;

import { WithThemeProvider } from './decorators';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        'System',
        'Layout',
        'Animation',
        'Core',
        'Components',
        'Advanced',
      ],
    },
  },
};

export const decorators = [WithThemeProvider];

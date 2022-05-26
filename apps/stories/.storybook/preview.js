import { WithThemeProvider, WithTranslationProvider } from './decorators';

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

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en_US',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en_US', title: 'English', right: 'United States' },
        { value: 'ar_MA', title: 'Arabic', right: 'Morroco' },
      ],
    },
  },
};

export const decorators = [WithThemeProvider, WithTranslationProvider];

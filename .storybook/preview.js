import { WithThemeProvider, WithTranslationProvider } from './decorators';
import { PARAM_KEY as DIRECTION } from './addons/rtl-switch/constants';
import { PARAM_KEY as LOCALE } from './addons/locale/constants';

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

export const decorators = [WithThemeProvider, WithTranslationProvider];

export const globals = {
  [DIRECTION]: undefined,
  [LOCALE]: undefined,
};

import { ThemeProvider } from '../../../packages/core/src/styles';

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
  direction: {
    name: 'Direction',
    description: 'Direction of document',
    defaultValue: 'ltr',
    toolbar: {
      icon: 'redirect',
      items: [
        { value: 'ltr', title: 'LTR' },
        { value: 'rtl', title: 'RTL' },
      ],
    },
  },
};

const withThemeProvider = (Story, context) => {
  const dir = context.globals.direction;
  return (
    <ThemeProvider dir={dir}>
      <div>
        <Story {...context} />
      </div>
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];

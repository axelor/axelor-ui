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

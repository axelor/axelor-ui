import { ThemeProvider } from '../../../src/core';

export const WithThemeProvider = (Story, context) => {
  const dir = context.globals.direction;
  return (
    <ThemeProvider dir={dir}>
      <div>
        <Story {...context} />
      </div>
    </ThemeProvider>
  );
};

export default WithThemeProvider;
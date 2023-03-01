import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: [
          {
            find: /^~(.*)/,
            replacement: '$1',
          },
        ],
      },
      define: {
        'process.env': {},
      },
    });
  },
};

export default config;

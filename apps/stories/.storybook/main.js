const svgr = require('vite-plugin-svgr').default;

module.exports = {
  stories: ['../../../packages/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-scss',
    '@storybook/addon-a11y',
    '@storybook/addon-toolbars',
    './addons/rtl-switch/register.jsx',
    './addons/locale/register.jsx',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  typescript: {
    reactDocgen: false,
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [...config.plugins, svgr()],
      resolve: {
        ...config.resolve,
        alias: [
          {
            find: /^~.+/,
            replacement: value => value.replace(/^~/, ''),
          },
        ],
      },
    };
  },
};

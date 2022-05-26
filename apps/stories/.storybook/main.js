const webpackFinal = require('./webpack.final');

module.exports = {
  stories: ['../../../packages/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-scss',
    '@storybook/addon-a11y',
    '@storybook/addon-toolbars',
    './addons/rtl-switch/register',
    './addons/locale/register',
  ],
  core: {
    builder: 'webpack5',
  },
  typescript: {
    reactDocgen: false,
  },
  webpackFinal,
};

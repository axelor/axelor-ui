const webpackFinal = require('./webpack.final');

module.exports = {
  stories: ['../../**/*.stories.tsx'],
  addons: [
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: true,
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-toolbars',
  ],
  core: {
    builder: 'webpack5',
  },
  typescript: {
    reactDocgen: false,
  },
  webpackFinal,
};

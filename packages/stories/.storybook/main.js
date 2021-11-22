module.exports = {
  stories: ['../../**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-toolbars'],
  core: {
    builder: 'webpack5'
  },
  typescript: {
    reactDocgen: false,
  },
};

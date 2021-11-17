module.exports = {
  stories: ['../../**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-toolbars'],
  core: {
    builder: 'storybook-builder-vite',
  },
  typescript: {
    reactDocgen: false,
  },
};

const svgr = require('vite-plugin-svgr');

module.exports = {
  stories: ['../../**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-toolbars'],
  core: {
    builder: 'storybook-builder-vite',
  },
  typescript: {
    reactDocgen: false,
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [...config.plugins, svgr()],
    };
  },
};

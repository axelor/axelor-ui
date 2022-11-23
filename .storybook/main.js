module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    './addons/rtl-switch/manager.jsx',
    './addons/locale/manager.jsx',
  ],
  "framework": {
    "name": "@storybook/react-vite",
  },
  "docs": {
    "docsPage": false
  }
};

const path = require('path');

const cssRegex = /\.css$/;
const scssRegex = /\.s[ca]ss$/;

const configureStyle = (type, pattern, config) => {
  const rule = config.module.rules.find(
    x => x.test && x.test.toString() === pattern.toString()
  );

  const loader = rule.use.find(
    x => x.loader && x.loader.match(/[\/\\]css-loader/g)
  );

  loader.options = {
    ...loader.options,
    modules: {
      auto: css => css.endsWith(`.module.${type}`),
      mode: css => (css.endsWith(`.module.${type}`) ? 'local' : 'pure'),
      localIdentName: 'css-[hash:base64:5]',
    },
  };
};

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-scss',
    '@storybook/addon-toolbars',
    './addons/rtl-switch/register.jsx',
    './addons/locale/register.jsx',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal(config) {
    configureStyle('css', cssRegex, config);
    configureStyle('scss', scssRegex, config);

    const fileLoaderRule = config.module.rules.find(
      rule => !Array.isArray(rule.test) && rule.test.test('.svg')
    );
    fileLoaderRule.exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    return config;
  },
};

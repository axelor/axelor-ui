const path = require('path')

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

module.exports = function webpackFinal(config) {
  configureStyle('css', cssRegex, config);
  configureStyle('scss', scssRegex, config);

  const fileLoaderRule = config.module.rules.find(
    (rule) => !Array.isArray(rule.test) && rule.test.test(".svg"),
  );
  fileLoaderRule.exclude = /\.svg$/;
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack", "url-loader"],
  });

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...config.resolve.alias,
    '@axelor-ui/core': path.resolve(__dirname, '../../../packages/core/src'),
  };

  return config;
};

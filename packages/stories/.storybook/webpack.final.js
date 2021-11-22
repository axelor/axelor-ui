const isCssRule = x => x && x.test && x.test.toString() === '/\\.css$/';
const isCssLoader = x => x && x.loader && x.loader.match(/[\/\\]css-loader/g);

module.exports = function webpackFinal(config) {
  const cssRule = config.module.rules.find(isCssRule);
  const cssLoader = cssRule.use.find(isCssLoader);

  cssLoader.options.modules = {
    auto: css => css.endsWith('.module.css'),
    mode: css => (css.endsWith('.module.css') ? 'local' : 'pure'),
  };

  return config;
};

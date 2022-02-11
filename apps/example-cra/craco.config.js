const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

const packagesDir = path.resolve('../../packages');

const packages = ['core'];
const sources = packages.map(name => path.join(packagesDir, name, 'src'));

module.exports = {
  webpack: {
    configure: (webpackConfig, arg) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include.concat(sources);
      }
      return webpackConfig;
    },
  },
};

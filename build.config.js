var package = require('./package.json');

var config = {
  appFiles: {
    js: [ 'src/app/**/*.js' ],
    jsx: [ 'src/app/**/*.jsx' ],
    html: [ 'src/index.html' ],
    less: [ 'src/less/main.less' ],
    assets: [ 'src/assets/**' ]
  },
  vendorFiles: {
    js: [],
    css: [ 'vendor/bootstrap-slider/slider.css' ],
    assets: [],
    fonts: [ 'node_modules/bootstrap/fonts/**' ]
  },
  vendorNpmPackages: Object.keys(package.dependencies),
  env: {
    dev: {
      isProduction: false,
      appNameAndVersion: package.name,
      dest: './build'
    },
    prod: {
      isProduction: true,
      appNameAndVersion: package.name + '-' + package.version,
      dest: './dist'
    }    
  }
};

module.exports = config;
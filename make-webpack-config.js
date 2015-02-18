var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (options) {

  return {
    entry: path.resolve(__dirname, 'src/app/main.jsx'),
    output: {
      path: path.resolve(__dirname, options.isProduction ? 'dist' : 'build'),
      filename: 'bundle.[hash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Moped'
      })
    ],
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'jsx' }, 
        { test: /\.less$/, loader: 'style!css!less' }, 
        { test: /\.(png|gif|jpg)$/, loader: 'url-loader?limit=8192' },
        { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
        { test: /\.woff2$/, loader: "url-loader?limit=10000&mimetype=application/font-woff2" },
        { test: /\.ttf$/, loader: "file-loader" },
        { test: /\.eot$/, loader: "file-loader" },
        { test: /\.svg$/, loader: "file-loader" }
      ]
    }
  };
};
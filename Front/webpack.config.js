var webpack = require('webpack');
var path = require('path');
const ETP= require('extract-text-webpack-plugin');

module.exports = {
    context: path.join(__dirname, "src"),
    entry: "./js/client.js",
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['react-html-attrs', 'transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
            }
          },
          {
          test: /\.scss$/,
          loader: ETP.extract({
            fallback: 'style-loader',
            use: 'css-loader!sass-loader'
          })
          }
      ]
    },
    output: {
        path: __dirname + "/src/",
        filename: "client.min.js"
    },
    devServer: {
    port: 8080,
    historyApiFallback: true
    },
    plugins: [
        new ETP('styles.css')
    ],
};

const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build")
    }, 
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Shape Tracker',
        template: './src/index.html',
        inject: 'body'
      })
    ],
    devServer: {
        hot: true,
        historyApiFallback: true
    }
};
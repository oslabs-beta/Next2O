
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, "./src/index.jsx"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /scss$/,
        use: ["style-loader", "css-loader", 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: 'file-loader',
        options: {
          name: '/public/icons/[name].[ext]'
        }
    },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx']
  },
  devtool: 'source-map',
  devServer: {
    host: 'localhost',
    port: 8080,
    static: {
      directory: path.resolve(__dirname, "./build"),
    },
    historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000/',
        secure: false
      }
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [{from: 'public'}]
    })
  ],
};

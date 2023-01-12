
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, "./src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        use: 'ts-loader',
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

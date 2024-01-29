const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssLoaders = [
  MiniCssExtractPlugin.loader,
  'css-loader',
];

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './js/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    assetModuleFilename: '[path][name][ext]',
    clean: false,
  },
  resolve: {
    extensions: ['.js', '.sass', '.scss', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
    },
  },
  devServer: {
    hot: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: [...cssLoaders],
      },
      {
        test: /\.(sass|scss)$/,
        use: [...cssLoaders, 'sass-loader'],
      },
      {
        test: /\.(svg|avif|webp|png|jpg)$/,
        type: 'asset/resource',
      },
    ],
  },
};

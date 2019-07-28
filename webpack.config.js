const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MediaQuerySplittingPlugin = require('media-query-splitting-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const SvgStore = require('webpack-svgstore-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const Imagemin = require('imagemin');
const ImageminJpegtran = require('imagemin-jpegtran');
const ImageminPngquant = require('imagemin-pngquant');
const ImageminSvgo = require('imagemin-svgo');
const ImageminWebp = require('imagemin-webp');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');

// For imagemin
(async() => {
  const files = await Imagemin(['images/*.{jpg,png,*.svg}'], {
    destination: 'build/images',
    plugins: [
      ImageminJpegtran({ arithmetic: true }),
      ImageminPngquant({
        quality: [0.6, 0.8],
      }),
      ImageminSvgo({
        plugins: [
          { removeViewBox: false },
        ],
      }),
      ImageminWebp({ quality: 50 }),
    ],
  });

  console.log(files);
  // => [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
})();

module.exports = {
  entry: {
    index: './src/js/index.js',
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, '/build'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          quiet: true,
          emitWarning: true,
        },
      },
      {
        test: /\.(js | jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: '65-80',
              },
              // Optipng.enabled: false will disable optipng
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // The webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { ident: 'postcss', sourceMap: true, config: { path: './postcss.config.js' },
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: './postcss.config.js' } },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'svg-sprite-loader',
            options: {
              spriteModule: './utils/sprite',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      minSize: 30000,
      maxSize: 0,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'commons',
          chunks: 'all',
          priority: -10,
        },
        default: {
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      prefetch: ['**.js'],
      preload: ['**.css'],
      hash: true,
      template: 'src/index.html',
      title: '',
      filename: 'index.html',
      minify: {
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
      },
      meta: {
        viewport: 'width=device-width, initial-scale=1,shrink-to-fit=no,viewport-fit=cover',
        'content-type': { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        name1: { name: 'description', content: ' ' },
        name2: { name: 'HandheldFriendly', content: 'True' },
        name3: { name: 'MobileOptimized', content: '320' },
        'http-equiv': { 'http-equiv': 'cleartype', content: 'on' },
        name4: { name: 'format-detection', content: 'telephone=no' },
        name5: { name: 'disabled-adaptations', content: 'watch' },
        name6: { name: 'apple-mobile-web-app-capable', content: 'yes' },
        name7: { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        name8: { name: 'mobile-web-app-capable', content: 'yes' },
      },
    }),
    new ResourceHintWebpackPlugin(), // Use only once
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new MediaQuerySplittingPlugin({
      media: {
        mobileEnd: 576,
        tabletPortraitEnd: false,
        tabletLandscapeEnd: false,
      },
      splitTablet: false,
    }),
    new CopyWebpackPlugin([
      {
        from: './src/fonts',
        to: './assets/fonts',
      },
      {
        from: './src/favicon',
        to: './assets/favicon',
      },
      {
        from: './src/images',
        to: './assets/images',
      },
    ]),
    new SpriteLoaderPlugin(),
    new SvgStore({
      // Svgo options
      svgoOptions: {
        plugins: [
          { removeTitle: true },
        ],
      },
      prefix: 'icon',
    }),
    new StyleLintPlugin({
      quiet: true,
      emitWarning: false,
    }),
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000,
    liveReload: true,
  },
};

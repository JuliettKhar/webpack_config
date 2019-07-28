module.exports = {
  plugins: [
    require('autoprefixer'),
    require('css-mqpacker'),
    require('postcss-move-media'),
    require('cssnano')({
      preset: [
        'default', {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};

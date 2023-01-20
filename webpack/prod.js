const {merge} = require('webpack-merge');
const path = require("path");
const base = require("./base");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebPackPlugin = require('copy-webpack-plugin')

module.exports = merge(base, {
  mode: "production",
  output: {
    filename: "bundle.min.js",
    path: path.resolve(process.cwd(), 'dist')
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["*"],
    }),
    new CopyWebPackPlugin({
      patterns: [
        {from: 'assets', to: '.'}
      ]
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});

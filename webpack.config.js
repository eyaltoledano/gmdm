const path    = require("path")
const webpack = require("webpack")

module.exports = {
  mode: "development",
  // mode: "production",
  devtool: "source-map",
  entry: {
    application: "./app/javascript/packs/application.js"
  },
  output: {
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    // chunkFormat: "module",
    path: path.resolve(__dirname, "app/assets/builds"),
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
}

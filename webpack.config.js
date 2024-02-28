const path    = require("path")
const webpack = require("webpack")

module.exports = {
  mode: "development",
  // mode: "production",
  devtool: "source-map",
  entry: {
    application: "./app/javascript/application.js"
  },
  output: {
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    // chunkFormat: "module",
    path: path.resolve(__dirname, 'public/javascripts'),
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx|)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', "@babel/preset-typescript"],
          }
        }
      },
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', 
        ],
      },
      {
        test: /\.postcss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', 
        ],
      },
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  }
}

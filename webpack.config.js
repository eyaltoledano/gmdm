const path    = require("path")
const webpack = require("webpack")

module.exports = {
  // mode: "development",
  mode: "development",
  cache: {
    type: 'filesystem', // Use filesystem caching
    buildDependencies: {
      config: [__filename] // Invalidate cache when configuration changes
    }
  },
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
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', // Run babel on a separate thread pool of workers to improve build speeds
            options: {
              // Specify the number of workers
              workers: 2, // Adjust this number based on your CPU cores and build requirements

              // Worker parallel jobs limit
              workerParallelJobs: 50,
              
              // Additional node.js arguments
              workerNodeArgs: ['--max-old-space-size=1024'],
              
              // Allow to respawn a dead worker pool
              poolRespawn: false,
              
              // Idle timeout for killing the worker processes
              poolTimeout: 2000, // Use 'Infinity' in watch mode to keep workers alive
              
              // Number of jobs a worker processes in parallel
              poolParallelJobs: 50,
              
              // Name of the pool
              name: "gmdm-pool"
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', "@babel/preset-typescript"],
              cacheDirectory: true, // Caches the output of the babel-loader
            }
          }
        ]
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
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "url": require.resolve("url/"),
    }
  },
  experiments: {
    backCompat: false,
  },
}

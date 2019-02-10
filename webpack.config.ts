import HtmlWebpackPlugin from 'html-webpack-plugin';
import { join } from 'path';
import { Configuration } from 'webpack';

const configuration: Configuration = {
  mode: 'production',

  entry: {
    app: join(__dirname, 'src/index.tsx')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.wasm', '.mjs', '.js', '.json']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', options: { transpileOnly: true } }
    ]
  },

  output: {
    chunkFilename: '[name].[hash].js',
    filename: '[name].[hash].js'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },

  plugins: [
    new HtmlWebpackPlugin()
  ]
};

export default configuration;

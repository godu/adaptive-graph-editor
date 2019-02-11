import webpack from 'webpack';
import webpackConfig from '../webpack.config';

webpack(webpackConfig, err => {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  }
});

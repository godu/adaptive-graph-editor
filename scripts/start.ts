import Webpack, { Configuration, HotModuleReplacementPlugin } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config';

const devServerOptions = {
  ...webpackConfig.devServer,
  hot: true,
  host: 'localhost',
  stats: {
    colors: true
  }
};

const devWepackConfig: Configuration = {
  ...webpackConfig,
  mode: 'development',
  plugins: [
    ...(webpackConfig.plugins || []),
    new HotModuleReplacementPlugin()
  ]
};
WebpackDevServer.addDevServerEntrypoints(devWepackConfig, devServerOptions);

const compiler = Webpack(devWepackConfig);
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(7000, () => {
  // tslint:disable-next-line:no-console
  console.log('Starting server on http://localhost:7000');
});

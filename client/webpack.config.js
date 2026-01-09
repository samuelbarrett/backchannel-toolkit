import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';

const env = dotenv.config.parsed || {};
const __dirname = import.meta.dirname;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// Base config that applies to either development or production mode.
const config = {
  entry: './src/index.tsx',
  output: {
    // Compile the source files into a bundle.
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    devMiddleware: {
      publicPath: '/',
    },
    proxy: {
      '/status': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { 
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
        exclude: /node_modules/,
      },
      {
        // Load CSS files. They can be imported into JS files.
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        }
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js'],
    }
  },
  plugins: [
    // Generate the HTML index page based on our template.
    // This will output the same index page with the bundle we
    // created above added in a script tag.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: './public/favicon.ico',
    }),
    new webpack.DefinePlugin(envKeys),
  ],
};

export default (env, argv) => {
  if (argv.mode === 'development') {
    // Set the output path to the `build` directory
    // so we don't clobber production builds.
    config.output.path = path.resolve(__dirname, 'build');

    // Generate source maps for our code for easier debugging.
    // Not suitable for production builds. If you want source maps in
    // production, choose a different one from https://webpack.js.org/configuration/devtool
    config.devtool = 'eval-cheap-module-source-map';

    // Include the source maps for Blockly for easier debugging Blockly code.
    config.module.rules.push({
      test: /(blockly\/.*\.js)$/,
      use: [import.meta.resolve('source-map-loader')],
      enforce: 'pre',
    });

    // Ignore spurious warnings from source-map-loader
    // It can't find source maps for some Closure modules and that is expected
    config.ignoreWarnings = [/Failed to parse source map/];
  }
  return config;
};

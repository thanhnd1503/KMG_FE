const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const env = require('dotenv').config({ path: './.env' });
const stagingEnv = require('dotenv').config({ path: './.env.staging' });
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const smp = new SpeedMeasurePlugin();
var HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const packageJson = require('./package.json');
var happyThreadPool = HappyPack.ThreadPool({ size: 3 });
// module.exports = smp.wrap({
module.exports = (webpackEnv, argv) => {
  const isStaging = webpackEnv?.staging;

  let myEnv = isStaging ? stagingEnv.parsed : env.parsed;
  let otherEnv = !isStaging ? stagingEnv.parsed : env.parsed;
  let publicUrl = isStaging ? stagingEnv.parsed.PUBLIC_URL : env.parsed.PUBLIC_URL;

  let parsedEnvs = {};
  for (const _key in otherEnv) {
    parsedEnvs[`process.env.${_key}`] = JSON.stringify('');
  }
  for (const _key in myEnv) {
    if (_key === 'NODE_ENV') {
      continue;
    }
    parsedEnvs[`process.env.${_key}`] = JSON.stringify(myEnv[_key] || '');
  }

  return {
    entry: './src/index.tsx',
    target: 'web',
    mode: isStaging ? 'production' : 'development',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: `static/js/[name].[contenthash:8].js?v=${packageJson.version}`,
      chunkFilename: `static/js/[name].[contenthash:8].chunk.js?v=${packageJson.version}`,
      publicPath: isStaging ? stagingEnv.parsed.PUBLIC_URL + '/' || '/' : '/',
      clean: true
    },
    cache: isStaging ? false : true, // disable on production
    resolve: {
      preferRelative: false,
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: {
        '@base': path.resolve(__dirname, 'src/base/'),
        '@product': path.resolve(__dirname, 'src/product/'),
        '@demo': path.resolve(__dirname, 'src/demo/'),
        '@dashboard': path.resolve(__dirname, 'src/dashboard/'),
        '@contract': path.resolve(__dirname, 'src/contract/'),
        '@customer': path.resolve(__dirname, 'src/customer/'),
        '@notification': path.resolve(__dirname, 'src/notification/'),
        '@account': path.resolve(__dirname, 'src/account/'),
        '@purchase': path.resolve(__dirname, 'src/purchase/'),
        '@sales': path.resolve(__dirname, 'src/sales/'),
        '@stock': path.resolve(__dirname, 'src/stock/'),
        '@vendor': path.resolve(__dirname, 'src/vendor/'),
        '@setting': path.resolve(__dirname, 'src/setting/'),
        '@adminsetting': path.resolve(__dirname, 'src/adminsetting/'),
        '@auction': path.resolve(__dirname, 'src/auction/'),
        // === Fix error of baseURL when removing create-react-app with react-app-rewired  ===
        base: path.resolve(__dirname, 'src/base/'),
        product: path.resolve(__dirname, 'src/product/'),
        demo: path.resolve(__dirname, 'src/demo/'),
        dashboard: path.resolve(__dirname, 'src/dashboard/'),
        contract: path.resolve(__dirname, 'src/contract/'),
        customer: path.resolve(__dirname, 'src/customer/'),
        notification: path.resolve(__dirname, 'src/notification/'),
        account: path.resolve(__dirname, 'src/account/'),
        purchase: path.resolve(__dirname, 'src/purchase/'),
        sales: path.resolve(__dirname, 'src/sales/'),
        stock: path.resolve(__dirname, 'src/stock/'),
        vendor: path.resolve(__dirname, 'src/vendor/'),
        setting: path.resolve(__dirname, 'src/setting/'),
        adminsetting: path.resolve(__dirname, 'src/adminsetting/'),
        auction: path.resolve(__dirname, 'src/auction/')
      },
      fallback: {
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        zlib: require.resolve('browserify-zlib'),
        'process/browser': require.resolve('process/browser')
      }
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                {
                  tag: 'link',
                  attribute: 'href',
                  type: 'src'
                }
              ]
            }
          }
        },
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          options: !isStaging
            ? {
                // disable type checker - we will use it in fork plugin
                // transpileOnly: true,
                happyPackMode: true
              }
            : {}
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          // exclude: /node_modules/
          include: [
            path.resolve(__dirname, 'src') // Your source code directory
          ],
          options: {
            compact: false
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource'
        },
        {
          test: /\.module\.css$/i,
          use: [
            isStaging ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isStaging ? '[hash:base64]' : '[name]__[local]__[hash:base64:5]'
                },
                sourceMap: !isStaging
              }
            }
          ]
        },
        {
          test: /\.css?$/,
          exclude: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]'
                }
              }
            }
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]'
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        }
      ]
    },
    ignoreWarnings: [/Failed to parse source map/],
    plugins: [
      new webpack.DefinePlugin(parsedEnvs),
      new CopyWebpackPlugin({
        patterns: [{ from: 'public' }]
      }),
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.ejs'),
        publicUrl: publicUrl,
        version: packageJson.version || '1.0.0'
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
        $: 'jquery',
        jQuery: 'jquery',
        Buffer: ['buffer', 'Buffer']
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      {
        apply: (compiler) => {
          compiler.hooks.compilation.tap('HtmlWebpackPluginAlterAssetTags', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('HtmlWebpackPluginAlterAssetTags', (data, cb) => {
              const version = packageJson.version || '1.0.0';

              data.headTags.forEach((tag) => {
                if (tag.tagName === 'link' && tag.attributes.href) {
                  tag.attributes.href += `?v=${version}`;
                }
              });

              cb(null, data);
            });
          });
        }
      },
      ...(!isStaging
        ? [
            new HappyPack({
              id: 'js',
              threadPool: happyThreadPool,
              loaders: ['babel-loader']
            }),
            new HappyPack({
              id: 'styles',
              threadPool: happyThreadPool,
              loaders: ['style-loader', 'css-loader', 'sass-loader']
            }),
            new HappyPack({
              id: 'typescript',
              threadPool: happyThreadPool,
              loaders: ['ts-loader']
            })
          ]
        : [])
    ],
    ...(!isStaging && {
      devServer: {
        // hot: 'only', // not auto reload
        port: 3001,
        historyApiFallback: true
      }
    }),
    performance: isStaging
      ? {
          hints: false,
          maxEntrypointSize: 512000,
          maxAssetSize: 512000
        }
      : {
          hints: false
        },
    stats: {
      colors: true
    },
    ...(!isStaging && { devtool: 'eval-cheap-module-source-map' }),
    optimization: isStaging
      ? {
          minimize: true,
          runtimeChunk: {
            name: 'manifest'
          },
          splitChunks: {
            chunks: 'all',
            // minSize: 200000,
            minSize: 150000,
            maxSize: 250000,
            minChunks: 1,
            maxAsyncRequests: 15,
            maxInitialRequests: 15,
            automaticNameDelimiter: '~',
            name: false,
            cacheGroups: {
              reactVendor: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                enforce: true
              },
              bootstrapVendor: {
                test: /[\\/]node_modules[\\/]react-bootstrap[\\/]/,
                enforce: true
              },
              jquery: {
                test: /[\\/]node_modules[\\/]jquery[\\/]/,
                enforce: true
              },
              jqueryui: {
                test: /[\\/]node_modules[\\/]jqueryui[\\/]/,
                enforce: true
              },
              reactFeather: {
                test: /[\\/]node_modules[\\/]react-feather[\\/]/,
                enforce: true
              },
              dateFns: {
                test: /[\\/]node_modules[\\/]date-fns[\\/]/,
                enforce: true
              },
              fullcalendar: {
                test: /[\\/]node_modules[\\/]@fullcalendar[\\/]/,
                enforce: true
              },
              vendor: {
                test: /[\\/]node_modules[\\/]!(react-bootstrap|react-world-flags|react|react-dom|@toast-ui|date-fns|grapesjs|jqueryui|jquery|apexcharts|react-feather|date-fns|@fullcalendar)[\\/]/
                // enforce: true,
              },
              baseModule: {
                test: /[\\/]src[\\/]base[\\/]/
                // enforce: true,
              }
            }
          }
        }
      : {
          runtimeChunk: true,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false
        }
    // });
  };
};

import webpack, {
  DefinePlugin,
  NoErrorsPlugin,
  ProvidePlugin,
  HashedModuleIdsPlugin
} from 'webpack'

import path from 'path'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import ManifestPlugin from'webpack-manifest-plugin'
import WebpackChunkHash from 'webpack-chunk-hash';

const {UglifyJsPlugin, CommonsChunkPlugin} = webpack.optimize

const ENV = process.env.NODE_ENV || 'development'

const entry = {
    vendor: ['react','react-dom','react-router','redux','react-redux'],
    app: './index.jsx'
}
const output = {
  path: path.join(__dirname, 'public'),
  pathinfo: true,//告诉 webpack 在 bundle 中引入「所包含模块信息」的相关注释。此选项默认值是 false，并且不应该用于生产环境(production)，但是对阅读开发环境(development)中的生成代码(generated code)极其有用。
  filename: 'js/[name].[chunkhash].js',//取8位的hash，默认是16位
}
const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
        {
            loader: 'babel-loader',
            options: {
                babelrc: true,
                //presets: ['env']
            }
        }
    ]
  },
  {
      test: require.resolve('zepto'),
      loader: 'exports-loader?window.Zepto!script-loader'
  }
]
const config = {
  context: path.join(__dirname, 'app'),
  entry,
  output,
  module: {
    rules
  },
  resolve: {
    alias: {
      css: path.join(__dirname, 'app/assets/css'),
      img: path.join(__dirname, 'app/assets/images'),
      fonts: path.join(__dirname, 'app/assets/fonts'),
      components: path.join(__dirname, 'app/components')
    },
    extensions: [".js", ".jsx"],
    modules: [path.resolve(__dirname, 'node_modules')]
  },
  plugins: [
    new DefinePlugin({ENV: JSON.stringify(ENV)}),
    new CommonsChunkPlugin({
        names: ['vendor','manifest'], 
        filename: 'js/vendor.[chunkhash].js',
        minChunks: Infinity//库文件不会被我们自己写的模块引用，所以永远不会被打包进来
    }),
    new ManifestPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest',
      inlineManifest: false
    }),//它会将 manifest 提取到一个单独的 JSON 文件中
  ],
  externals: {
    zepto: 'jQuery'
  },
  devtool: 'source-map'
}

if (ENV === 'development') {
  /************************************************************************
  *                               DEVELOPMENT
  *************************************************************************/
  config.plugins.push(new NoErrorsPlugin())//跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
  // config.devtool = 'inline-source-map'
  config.devtool = 'eval-source-map'
} else {
  /************************************************************************
  *                               PRODUCTION
  *************************************************************************/
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: true,
    compress: {
      sequences: true,
      dead_code: true,
      unused: true
    },
    compressor: {
      warnings: false
    },
    output: {
      comments: false
    }
  }))

  config.module.rules.push({
    test: /\.(scss|sass|css)$/,
    use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: 'css-loader'
    })
  })

  config.plugins.push(new ExtractTextPlugin({
      filename: 'public/css/[name].[chunkhash].css',
      allChunks: true
  }))
}

export default config
let path = require('path');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
module.exports = {
    entry: {
        app: './app/index.js'
    }, // 入口文件路径
    output: {
        path: path.join(__dirname, 'public/js/[hash]'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/, // babel 转换为兼容性的 js
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015','react']
                }
            }
        ]
    }
}
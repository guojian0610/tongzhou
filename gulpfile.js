const gulp = require('gulp');
const webpack = require('gulp-webpack');  // gulp-webpack 用来处理 es6 以及 jsx
gulp.task('webpack', function () {
    return gulp.src('src/**/*.jsx')
        .pipe(webpack({
            watch: true,
            entry: {
                index: './src/index.jsx'
            },
            output: {
                filename: './js/[name].js',
                chunkFilename: './js/[name].chunk.js',
            },
            module: {
                loaders: [{
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    query: {
                        compact: false,
                        presets: ['es2015', 'react']
                    }
                }, {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }]
            }
        }))
        .pipe(gulp.dest('dist/'));
});
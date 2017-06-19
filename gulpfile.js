var fs = require('fs');
var gulp = require('gulp');
var webpack = require('webpack');
var del = require('del');
var createWebpackConfig = require('./create-webpack.config.js');
var zip = require('gulp-zip');


gulp.task('default', ['build-dev', 'build']);

gulp.task('clean', function () {
    return del([
        '../public/CommunityPortal/js/app-*/'
    ], {
        force: true
    });
});

gulp.task('clean:dev', function () {
    return del([
        '../public/CommunityPortal/js/debug/'
    ], {
        force: true
    });
});

gulp.task('build:lib', function (cb) {
    webpack(createLibsWebpackConfig(), function (err, stats) {
        if (err) throw new Error(err);

        if (stats.compilation.errors.length) {
            console.log(stats.compilation.errors[0].error);
        }

        console.log('webpack libs end');
        cb();
    });
});

gulp.task('build', ['clean'], function (cb) {
    webpack(createWebpackConfig(), function (err, stats) {
        if (err) throw new Error(err);

        if (stats.compilation.errors.length) {
            console.log(stats.compilation.errors[0].error.message);
        }

        console.log('webpack app end');
        cb();
    });
});

gulp.task('build:lib:dev', function (cb) {
    webpack(createLibsWebpackConfig(true), function (err, stats) {
        if (err) throw new Error(err);

        if (stats.compilation.errors.length) {
            console.log(stats.compilation.errors[0].error);
        }

        console.log('webpack libs dev end');
        cb();
    });
});

gulp.task('build:dev', ['clean:dev'], function (cb) {
    webpack(createWebpackConfig(true), function (err, stats) {
        if (err) throw new Error(err);

        if (stats.compilation.errors.length) {
            console.log(stats.compilation.errors[0].error.message);
        }

        console.log('webpack app dev end');
        cb();
    });
});

gulp.task('cdn', ['zip'], function () {
    let publishOptions = {
        login: [
            {
                'userName': 'devicalin'                                          // 对应的登录名字
            },
            {
                'userName': 'jamesguo'
            }
        ],
        deploy: {
            'appId': 43280,                                                   // 必填, 在config.js里可查你业务对应的id
            'compressjs': false,
            'compresscss': false,
            'localdir': '../public/CommunityPortal',                                           // 必填，上传js/css的目录名
            'baseurl': 'http://res.imtt.qq.com/game_list/ApkStore/CommunityPortal/',             // 必填，上传到CDN路径
            'vars': 'VER=$TimeStamp$',                                       // 必填
            'mappings': [
                {                                                   // 必填
                    'key': 'js/app-*.zip',
                    'value': '$PATH$/$NAME$.$EXT$'
                },
                // {
                //     'key': 'css/main-min.css',
                //     'value': '$PATH$/$NAME$.$EXT$'
                // }
            ]
        },
        // taf: [{                                                             // 必填，用于上传配置文件到TAF SERVER
        //     'taskName': 'MTT.ApkStoreServer',
        //     'timeStamp': '$TimeStamp$',
        //     'tasks': [{
        //         'serverName': 'MTT.ApkStoreServer',
        //         'serverId': 'MTT.ApkStoreServer_10.209.15.37',
        //         'serverPrefix': 'MTT',
        //         'serverLiteName': 'ApkStoreServer',
        //         'nodeName': '10.209.15.37',
        //         'targetConfigs': [{
        //             'src': 'test.html',                                     // 源配置文件名
        //             'target': 'test.html'                                   // 目标配置文件名
        //         }]
        //     }]
        // }]
    };

    return gulp.src('../public/CommunityPortal/js')
        .pipe(publishHelper(publishOptions));
});

gulp.task('zip', function(){
    let dirPath = '../public/CommunityPortal/js';
    let list = fs.readdirSync(dirPath);
    let zipFileName = '';
    for(let name of list){
        if(/app-[^.]+$]/.test(name)) {
            zipFileName = name;
            break;
        }
    }

    return gulp.src('../public/CommunityPortal/js/app-*/*')
        .pipe(zip(zipFileName + '.zip'))
        .pipe(gulp.dest(dirPath));
});

gulp.task('watch', ['build:dev'], function(){
    gulp.watch('client/**', ['build:dev']);
    gulp.watch('common/**', ['build:dev']);
    gulp.watch('../Resource/**', ['build:dev']);
});

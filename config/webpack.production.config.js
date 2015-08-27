var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: [
            './src/components/app'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?minimize!autoprefixer!sass?includePaths[]=' + path.resolve(__dirname, '../src/scss'))
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: path.resolve(__dirname, '../src')
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(eot|svg|ttf|woff)$/,
                loader: 'file?name=fonts/[hash].[ext]',
                include: path.resolve(__dirname, '../src/fonts')
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'file?name=img/[hash].[ext]',
                include: path.resolve(__dirname, '../src/img')
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        publicPath: '/static/',
        path: path.resolve(__dirname, '../static')
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                pure_funcs: ['console.log']
            }
        }),
        new ExtractTextPlugin('[name].bundle.css')
    ],
    resolve: {
        alias: {
            'TweenLite': path.resolve(__dirname, '../node_modules/gsap/src/minified/TweenLite.min.js'),
            'TimelineLite': path.resolve(__dirname, '../node_modules/gsap/src/minified/TimelineLite.min.js'),
            'CSSPlugin': path.resolve(__dirname, '../node_modules/gsap/src/minified/plugins/CSSPlugin.min.js'),
            'EasePack': path.resolve(__dirname, '../node_modules/gsap/src/minified/easing/EasePack.min.js'),
            'ScrollToPlugin': path.resolve(__dirname, '../node_modules/gsap/src/minified/plugins/ScrollToPlugin.min.js')
        },
        extensions: ['', '.js', '.jsx']
    }
};

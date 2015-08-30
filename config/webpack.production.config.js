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
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?minimize')
            },
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
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('[name].bundle.css')
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: {
        app: [
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client',
            './src/components/app'
        ],
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer!sass?includePaths[]=' + path.resolve(__dirname, '../src/scss')
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
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

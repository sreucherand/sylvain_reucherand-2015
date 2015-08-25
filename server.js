var express = require('express');
var glob = require('glob');
var path = require('path');

var app = express();

app.set('view engine', 'jade');
app.set('views', path.resolve('src/views'));
app.set('env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 8019);

app.use('/static', express.static('./static'));

if (app.get('env') === 'development') {
    var config = require('./config/webpack.development.config');
    var compiler = require('webpack')(config);

    app.use(require('webpack-dev-middleware')(compiler, {lazy: false, publicPath: config.output.publicPath}));
    app.use(require('webpack-hot-middleware')(compiler));
}

app.locals.pretty = true;

glob(path.join(__dirname, 'src/routes/**/*.js'), {sync: true}).forEach(function (route) {
    require(route)(app);
});

app.listen(app.get('port'), function () {
    console.log('Express application listening on port', app.get('port'));
});

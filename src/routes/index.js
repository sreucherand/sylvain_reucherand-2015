var express = require('express');
var router = express.Router();

var data = require('../data/data');

router.get('/', function (req, res) {
    res.render('index', data);
});

module.exports = function (app) {
    app.use('/', router);
    app.use('/:project', router);
};

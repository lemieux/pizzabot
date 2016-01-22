'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var webhooks = require('./webhooks');
var errors = require('../errors');

var validateContentType = (req, res, next) => {
    if (['put', 'post'].some(method => req.method.toLowerCase() === method) && !req.is('json')) {
        return next(new errors.BadContentType());
    }

    return next();
};

var errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.code);
    return res.json({
        code: err.code,
        message: err.message
    });

};

var router = express.Router();

router
    .use(bodyParser.json())
    .use(validateContentType)
    .use('/webhooks', express.Router()
        .post('/smooch', webhooks.smooch))
    .use(errorHandler);


module.exports = router;

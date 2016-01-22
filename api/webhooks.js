'use strict';

var smoochController = require('../controllers/smooch');

module.exports.smooch = (req, res, next) => {
    smoochController.handleWebhook(req.body).catch(next).then(() => {
        res.end();
    });
};

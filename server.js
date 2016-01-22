'use strict';

const config = require('./config');
var express = require('express');

var smoochController = require('./controllers/smooch');

var app = express();

app.use('/api/', require('./api'));

smoochController.setUpWebhook(app).then(() => {
    app.listen(config.get('PORT') || 3000);
});

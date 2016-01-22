'use strict';

var express = require('express');

var smoochController = require('./controllers/smooch');

var app = express();

app.use('/api/', require('./api'));

smoochController.setUpWebhook(app).then(() => {
    app.listen(3000, () => {
        console.log('Listening on 3000...')
    });
});

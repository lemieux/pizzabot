'use strict';

var jwt = require('jsonwebtoken');
var Smooch = require('smooch-core');
var urljoin = require('urljoin');

var config = require('../config');
var errors = require('../errors');
var aiController = require('./api-ai');

const webhookUrl = urljoin(config.get('HOST'), 'api/webhooks/smooch');

const core = new Smooch({
    keyId: config.get('SMOOCH_KEYID'),
    secret: config.get('SMOOCH_SECRET'),
    scope: 'app'
});

module.exports.setUpWebhook = (app) => {
    return core.webhooks.list()
        .then((response) => {
            console.log(response)
            let webhook = response && response.webhooks.find((w) => {
                    return w.target === webhookUrl
                });

                if (!webhook) {
                    return core.webhooks.create({
                        target: webhookUrl
                    });
                }
            }).catch(console.log);
    };

    module.exports.handleWebhook = (payload) => {
        return Promise.resolve().then(() => {
            console.log(payload);
            let message = payload.messages[0];
            if (message.role === 'appUser') {
                return aiController.call(payload.appUser._id, message.text);
            }
        });
    }

    module.exports.sendMessage = (userId, text, from, metadata) => {
        console.log('sending message', text)
        from || (from = { });
        metadata || (metadata = { });
        return core.conversations.sendMessage(userId, {
            text: text,
            role: 'appMaker',
            name: from.name || 'Pizzabot',
            avatarUrl: from.avatarUrl,
            metadata: metadata
        });
    }

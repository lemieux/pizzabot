'use strict';

const config = require('../config');
const apiai = require('apiai');

const smoochController = require('./smooch');

const PIZZA_RATIO = 3.0 / 8.0;

module.exports.call = (userId, message) => {
    const apiApp = apiai(config.get('API_AI_CLIENT_ACCESS'), config.get('API_AI_SUBSCRIPTION_KEY'), {
        sessionId: userId
    });
    return new Promise((resolve, reject) => {
        let request = apiApp.textRequest(message);
        request.on('response', (response) => {
            console.log(response)
            let result = response.result;
            console.log(result);
            if (result.actionIncomplete) {
                smoochController.sendMessage(userId, result.fulfillment.speech);
                resolve(result);
            } else {
                handleAction(userId, result.action, result.parameters, result.fulfillment).then(() => {
                    resolve(result);
                });
            }
        });

        request.on('error', (err) => {
            reject(err);
        });

        request.end();
    });
};


let handleAction = module.exports.handleAction = (userId, action, parameters, fulfillment) => {
    if (!action) {
        return;
    }

    if (action.startsWith('smalltalk.')) {
        return smoochController.sendMessage(userId, fulfillment.speech);
    }

    switch (action) {
        case 'compute_pizza_count':
            return handlePizzaCount(userId, parameters.count);
        case 'calculator.math':
            return smoochController.sendMessage(userId, parameters.result);
        case 'bill_split':
            return handleBillSplitting(userId, parameters.amount, parameters.people, parameters.tip);
        default:
            return smoochController.sendMessage(userId, 'I\'m sorry but I can\'t process what you are asking.');
    }
};

let handlePizzaCount = (userId, count) => {
    return Promise.resolve().then(() => {
        let message;
        count = +count;
        if (count === 0) {
            message = 'Hmmmm ok...';

        } else if (count === 1) {
            message = 'A small pizza should do.'
        } else if (count === 2) {
            message = 'Two small or one medium should be enough.'
        } else {
            let largePizzas = Math.floor(count * PIZZA_RATIO);
            const modulo = count * PIZZA_RATIO - largePizzas;

            let extraPizza;

            if (modulo >= 0.5) {
                largePizzas += 1;
            } else if (modulo >= 0.2) {
                extraPizza = 'medium';
            } else if (modulo > 0) {
                extraPizza = 'small';
            }

            message = `You should order ${largePizzas} large pizza${largePizzas > 1 || largePizzas === 0 ? 's' : '' }`;

            if (extraPizza) {
                message += ` and maybe 1 ${extraPizza} pizza`;
            }

            message += '.';
        }

        return smoochController.sendMessage(userId, message);
    }).catch(console.log);
};

let handleBillSplitting = (userId, amount, people, tip) => {
    return Promise.resolve().then(() => {
        let fullAmount = amount * (1 + tip / 100);
        let parts = parseFloat(fullAmount / people).toFixed(2);
        return smoochController.sendMessage(userId, `That makes ${parts}$ each.`);
    }).catch(console.log);
}

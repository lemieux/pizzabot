# Pizzabot
Ever had that silly idea of building an app for fun, but you don't want to build an interface for it and everything? If your idea is basic enough to accept an input and provide an output, then why don't you do that through a conversation, over SMS?

Here's my silly idea : ever wondered how many pizzas you should order?

Well, someone at [Gawker](http://gawker.com/how-many-pizzas-should-you-order-the-pizza-equation-wi-1697815579) came up with the basic math to do it and it works surprisingly well. Now, let's make that a service people can text and get their answer.

By combining [Smooch](https://smooch.io?utm_source=pizzabot), [Twilio](https://twilio.com), and [api.ai](https://api.ai), you can do this quite easily. Smooch allows you a Twilio number to your server using webhooks. Smooch will send the message to your server everytime someone texts your Twilio number. With that message, the server forwards it to api.ai. Then, you can leverage the intents we previously created on api.ai to take action on these messages.

api.ai has this really nice [dialog](https://docs.api.ai/docs/dialogs) feature that allows you to initiate a serie of questions to get answers. If a message triggers one of your intent, but didn't provide some of your required parameters, the dialog kicks in and start asking questions until the user provides the answer. When it's done, api.ai response marks the action as completed and gives you all the parameters you defined. At this point, you can take action on that.

The concept of this server is pretty much : let api.ai do the talking and once it sends us a completed action, let's decide if it's actionable or not. For this server, I decided to let api.ai do the smalltalk and to handle pizza count calculations and bill splitting. From that point, it's really up to you to decide whatever action you should handle.

Enough talk, just try it! Text something at (no longer in service) and see for yourself!

This server basically need only these environment variables to run on Heroku :

| Variable | Description |
|--------- | ----------- |
| HOST | URL of the server |
| SMOOCH_KEYID | Smooch key Id (found in your Smooch app settings) |
| SMOOCH_SECRET | Smooch secret (found right next to the key id) |
| API_AI_SUBSCRIPTION_KEY | api.ai subscription key (found in your agent settings) |
| API_AI_CLIENT_ACCESS | api.ai client access key (found right next to the subscription key) |

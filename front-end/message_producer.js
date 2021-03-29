const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };
const exchangeName = 'order_exchange';
const delay = 1250;

module.exports = {
    produceMessage(message) {
        amqp.connect('amqp://localhost', opt, function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                //'spread' type exchange
                channel.assertExchange(exchangeName, 'fanout', {
                    durable: false
                });

                setTimeout(() => {
                    channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)));
                    console.log(`Message sent ${message.id} in ${delay}ms`);
                }, delay)
            });
        });
    }
}
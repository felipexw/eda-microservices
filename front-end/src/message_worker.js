const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };
const orderPlaceFail = 'order.place.fail';

const orderExchangeName = 'order_exchange'

amqp.connect('amqp://localhost', opt, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertExchange(orderExchangeName, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            channel.bindQueue(q.queue, orderExchangeName, orderPlaceFail);

            console.log('[message-worker] Waiting for logs. To exit press CTRL+C');

            channel.consume(q.queue, function (msg) {
                const data = JSON.parse(msg.content.toString());
                console.info(`Order place failed by ${data.serviceName} orderId: ${data.id}`)
            }, {
                noAck: true
            });
        });
    });
});
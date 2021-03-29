const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };
const orderPlaceFailed = 'order-place.failed.*';
const orderPlaceSuccessfully = 'order-place.finished';

const orderExchangeName = 'order_exchange'

amqp.connect('amqp://localhost', opt, function (error0, connection) {
    if (error0) {
        throw error0;
    }

    subscribeToOrderPlaceSuccessEvt(connection);

    subscribeToOrderPlaceFailEvt(connection);
});

function subscribeToOrderPlaceFailEvt(connection) {
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
            channel.bindQueue(q.queue, orderExchangeName, orderPlaceFailed);

            console.log('\n ---- [message-worker-error] Waiting for logs. To exit press CTRL+C ----');

            channel.consume(q.queue, function (msg) {
                const data = JSON.parse(msg.content.toString());
                console.info(`[message-worker-error] order-place.failed by ${data.serviceName} orderId: ${data.id}`)
            }, {
                noAck: true
            });
        });
    });
}

function subscribeToOrderPlaceSuccessEvt(connection) {
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
            channel.bindQueue(q.queue, orderExchangeName, orderPlaceSuccessfully);

            console.log('\n ---- [message-worker-success] Waiting for logs. To exit press CTRL+C ----');

            channel.consume(q.queue, function (msg) {
                const data = JSON.parse(msg.content.toString());
                console.info(`[message-worker-succes] order-place.finished successfully by ${data.serviceName} orderId: ${data.id}`)
            }, {
                noAck: true
            });
        });
    });
}
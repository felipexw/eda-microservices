const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };
const orderPlaceSuccessfully = 'order-place.finished';
const orderPlaceFailed = 'order-place.failed.by-billing';
const orderInventoryFinished = 'order.inventory.finished';

const orderExchangeName = 'order_exchange'

amqp.connect('amqp://localhost', opt, function (error0, connection) {
    if (error0) {
        throw error0;
    }

    subscribeToInventoryEvt(connection);
});


function subscribeToInventoryEvt(connection) {
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
            console.log(' --- [billing-worker-success] Waiting for logs. To exit press CTRL+C ---');

            channel.bindQueue(q.queue, orderExchangeName, orderInventoryFinished);

            channel.consume(q.queue, function (msg) {
                if (msg.fields.routingKey === orderInventoryFinished) {
                    console.log(" [billing-worker-success] %s %s:'%s'", new Date(), msg.fields.routingKey, msg.content.toString());

                    const order = JSON.parse(msg.content.toString());
                    if (order.reject === 'order.billing') {
                        const data = { serviceName: 'billing-service', orderId: order.id }
                        setTimeout(() => {
                            channel.publish(orderExchangeName, orderPlaceFailed, Buffer.from(JSON.stringify(data)));
                        }, 1250)
                    }
                    else {
                        setTimeout(() => {
                            channel.publish(orderExchangeName, orderPlaceSuccessfully, Buffer.from(msg.content.toString()));
                        }, 1250)
                    }
                }
            }, {
                noAck: true
            });
        });
    });
}
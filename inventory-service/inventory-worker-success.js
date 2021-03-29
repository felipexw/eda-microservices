const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };
const orderPlaceStartTopic = 'order-place.start';
const orderPlaceFail = 'order-place.failed.by-inventory';
const orderInventoryFinished = 'order.inventory.finished';
const orderBillingRejected = 'order-place.failed.by-billing';

const orderExchangeName = 'order_exchange'

amqp.connect('amqp://localhost', opt, function (error0, connection) {
    if (error0) {
        throw error0;
    }

    subscribeToOrderBillingEvt(connection);
    subscribeToOrderPlaceEvt(connection);
});

function subscribeToOrderPlaceEvt(connection) {
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
            console.log(' --- [inventory-worker] Waiting for logs. To exit press CTRL+C --- ');

            channel.bindQueue(q.queue, orderExchangeName, orderPlaceStartTopic);

            channel.consume(q.queue, function (msg) {
                console.log(" [inventory-worker] %s %s:'%s'", new Date(), msg.fields.routingKey, msg.content.toString());

                const order = JSON.parse(msg.content.toString());
                if (order.reject === 'order.inventory') {
                    const data = { serviceName: 'inventory-service', orderId: order.id }
                    setTimeout(() => {
                        console.log(` [inventory-worker] order rejected by inventory worker. Order data: ${msg.content.toString()} `);
                        channel.publish(orderExchangeName, orderPlaceFail, Buffer.from(JSON.stringify(data)));
                    }, 1250)
                }
                else {
                    setTimeout(() => {
                        channel.publish(orderExchangeName, orderInventoryFinished, Buffer.from(msg.content.toString()));
                    }, 1250)
                }
            }, {
                noAck: true
            });
        });
    });
}

function subscribeToOrderBillingEvt(connection) {
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
            console.log(' --- [inventory-worker-succes] Waiting for logs. To exit press CTRL+C --- ');

            channel.bindQueue(q.queue, orderExchangeName, orderBillingRejected);

            channel.consume(q.queue, function (msg) {
                console.log(" [inventory-worker-rejected] %s %s:'%s'", new Date(), msg.fields.routingKey, msg.content.toString());

                const order = JSON.parse(msg.content.toString());
                if (order.reject === 'order.inventory') {
                    const data = { serviceName: 'inventory-service' }
                    channel.publish(orderExchangeName, orderPlaceFail, Buffer.from(JSON.stringify(data)));
                }
                else {
                    channel.publish(orderExchangeName, orderInventoryFinished, Buffer.from(msg.content.toString()));
                }
            }, {
                noAck: true
            });
        });
    });
}
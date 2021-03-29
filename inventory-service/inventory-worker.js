const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };
const orderPlaceStartTopic = 'order.place.start';
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
            console.log(' [inventory-worker] Waiting for logs. To exit press CTRL+C');

            channel.bindQueue(q.queue, orderExchangeName, orderPlaceStartTopic);

            channel.consume(q.queue, function (msg) {
                console.log(" [inventory-worker] %s %s:'%s'", new Date(), msg.fields.routingKey, msg.content.toString());

                const order = JSON.parse(msg.content.toString());
                if (order.reject === 'order.inventory') {
                    //console.log(" [inventory-worker] %s %s:'%s'", new Date(), msg.fields.routingKey, ' order inventory provisioning failed. order id: ' + order.id);
                    const data = { serviceName: 'inventory-service', orderId: order.id }
                    channel.publish(orderExchangeName, orderPlaceFail, Buffer.from(JSON.stringify(data)));
                }
            }, {
                noAck: true
            });
        });
    });
});
const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };
const orderPLaceSuccessfully = 'order.place.finished';
const orderPlaceFail = 'order.place.fail';
const orderInventoryFinished = 'order.inventory.finished';

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
            console.log(' [billing-worker] Waiting for logs. To exit press CTRL+C');

            channel.bindQueue(q.queue, orderExchangeName, orderInventoryFinished);

            channel.consume(q.queue, function (msg) {
                console.log(" [billing-worker] %s %s:'%s'", new Date(), msg.fields.routingKey, msg.content.toString());

                const order = JSON.parse(msg.content.toString());
                if (order.reject === 'order.billing') {
                    //console.log(" [inventory-worker] %s %s:'%s'", new Date(), msg.fields.routingKey, ' order inventory provisioning failed. order id: ' + order.id);
                    const data = { serviceName: 'billing-service', orderId: order.id }
                    setTimeout(() => {
                        channel.publish(orderExchangeName, orderPlaceFail, Buffer.from(JSON.stringify(data)));
                    }, 1250)
                }
                else {
                    setTimeout(() => {
                        channel.publish(orderExchangeName, orderPLaceSuccessfully, Buffer.from(msg.content.toString()));
                    }, 1250)
                }
            }, {
                noAck: true
            });
        });
    });
});
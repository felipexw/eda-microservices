const express = require('express')
const router = express.Router()

const producer = require('../message_producer')

router.post('/order', (request, res, next) => {
    /* 	#swagger.tags = ['Order place']
       #swagger.description = 'Endpoint to place an order' */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User data.',
            required: true,
            schema: { $ref: "#/definitions/PlaceOrder" }
    } */

    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    const order = request.body

    console.log(`order placed successfully. OrderId: ${order.id}`)

    producer.produceMessage(order);

    res.status(200).json({
        data: order,
        message: 'Successfully found'
    })
})

module.exports = router
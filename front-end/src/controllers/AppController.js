const express = require('express')
const router = express.Router()
const authorize = require('../middlewares/auth')

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
    Object.keys(request)
    setTimeout(() => {
        console.log(`order placed successfully. OrderId: ${order.id}`)

        res.status(200).json({
            data: order,
            message: 'Successfully found'
        })
    }, 1750)
})

module.exports = router
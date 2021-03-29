const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

/* Routes */
const router = require('./routes')

/* Middlewares */
app.use(router)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const port = process.argv[2] && process.argv[2].length ? process.argv[2].split("=")[1] || 3000 : 3000

app.listen(port, () => {
    console.log(`Server is running!\nAPI documentation: http://localhost:${port}/doc`)
})
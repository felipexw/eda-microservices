const swaggerAutogen = require('swagger-autogen')()

const port = process.argv[2] && process.argv[2].length ? process.argv[2].split("=")[1] || 3000 : 3000

const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: `localhost:${port}`,
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Order",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: "apiKey",
            in: "header",       // can be "header", "query" or "cookie"
            name: "X-API-KEY",  // name of the header, query parameter or cookie
            description: "any description..."
        }
    },
    definitions: {
        PlaceOrder: {
            date: "22/02/2021",
            total: 213,
            id: 2123,
            product: "Product/service"
        }
    }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/index.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/index')           // Your project's root file
})
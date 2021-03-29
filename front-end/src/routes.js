
const express = require('express')
const router = express.Router()

const appController = require('./controllers/AppController')

router.use(appController)

module.exports = router
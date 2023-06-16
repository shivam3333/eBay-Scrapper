const express = require('express')
const scrapperController = require('../../controllers/scrapper.controller');
const router = express.Router()

router.get('/processEbayJSON', scrapperController.processEbayJSON);

module.exports = router

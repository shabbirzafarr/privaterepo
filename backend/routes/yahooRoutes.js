const express = require('express');
const router = express.Router();
const yahooController = require('../controllers/yahooController');

router.get('/search', yahooController.search);
router.get('/quote', yahooController.quote);

module.exports = router;

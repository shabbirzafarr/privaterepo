const express = require('express');
const router = express.Router();
const yahooController = require('../controllers/yahooController');

router.get('/search', yahooController.search);
router.get('/price', yahooController.price);
router.get('/about', yahooController.aboutCompany);
router.get('/history', yahooController.historicalData);


module.exports = router;
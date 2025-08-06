const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/', assetController.getPortfolio);
router.post('/buy', assetController.buyAsset);
router.post('/sell', assetController.sellAsset);

module.exports = router;
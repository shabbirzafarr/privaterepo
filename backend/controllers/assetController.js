const assetModel = require('../models/assetModel');

exports.getPortfolio = (req, res) => {
  const { ps_id } = req.query;
  assetModel.getAssetsByUser(ps_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.buyAsset = (req, res) => {
  const { ps_id, symbol, company_name, quantity, purchase_price } = req.body;
  const data = [ps_id, symbol, company_name, quantity, purchase_price];
  assetModel.insertAsset(data, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Asset purchased successfully' });
  });
};

exports.sellAsset = (req, res) => {
  const { ps_id, symbol, quantity } = req.body;
  assetModel.getAssetQuantity(ps_id, symbol, (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Asset not found' });
    const existingQty = results[0].quantity;
    if (existingQty < quantity) return res.status(400).json({ error: 'Not enough quantity' });

    if (existingQty === quantity) {
      assetModel.removeAsset(ps_id, symbol, (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: 'Asset sold and removed' });
      });
    } else {
      const newQty = existingQty - quantity;
      assetModel.updateAssetQuantity(newQty, ps_id, symbol, (err3) => {
        if (err3) return res.status(500).json({ error: err3 });
        res.json({ message: 'Asset quantity updated after selling' });
      });
    }
  });
};

const assetModel = require('../models/assetModel');

const PS_ID = '4545'; // 🔐 Constant user ID

// Get portfolio by ps_id
exports.getPortfolio = (req, res) => {
  const ps_id = PS_ID;

  assetModel.getAssetsByUser(ps_id, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err });
    }
    console.log(`Results for ps_id ${ps_id}:`, results);
    res.json(results);
  });
};

// Buy asset (insert or update)
exports.buyAsset = (req, res) => {
  const ps_id = PS_ID;
  const { symbol, company_name, quantity, purchase_price } = req.body;

  if (!symbol || !company_name || !quantity || !purchase_price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  assetModel.getAssetQuantity(ps_id, symbol, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const newQty = Number(quantity);

    if (results.length > 0) {
      const updatedQty = results[0].quantity + newQty;
      assetModel.updateAssetQuantity(updatedQty, ps_id, symbol, (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: 'Existing asset quantity updated successfully' });
      });
    } else {
      const data = [ps_id, symbol, company_name, quantity, purchase_price];
      assetModel.insertAsset(data, (err3) => {
        if (err3) return res.status(500).json({ error: err3 });
        res.json({ message: 'Asset purchased successfully' });
      });
    }
  });
};

// Sell asset (update or remove)
exports.sellAsset = (req, res) => {
  const ps_id = PS_ID;
  const { symbol, quantity } = req.body;

  if (!symbol || !quantity) {
    return res.status(400).json({ error: 'symbol and quantity are required' });
  }

  const requestedQty = Number(quantity);
  if (isNaN(requestedQty)) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  assetModel.getAssetQuantity(ps_id, symbol, (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Asset not found' });
    }

    const existingQty = results[0].quantity;
    if (existingQty < requestedQty) {
      return res.status(400).json({ error: 'Not enough quantity to sell' });
    }

    if (existingQty === requestedQty) {
      assetModel.removeAsset(ps_id, symbol, (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: 'Asset sold and removed completely' });
      });
    } else {
      const newQty = existingQty - requestedQty;
      assetModel.updateAssetQuantity(newQty, ps_id, symbol, (err3) => {
        if (err3) return res.status(500).json({ error: err3 });
        res.json({ message: 'Asset quantity updated after selling' });
      });
    }
  });
};

const db = require('./db');

exports.getAssetsByUser = (ps_id, callback) => {
  db.query('SELECT * FROM assets WHERE ps_id = ?', [ps_id], callback);
};

exports.insertAsset = (data, callback) => {
  const sql = 'INSERT INTO assets (ps_id, symbol, company_name, quantity, purchase_price) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, data, callback);
};

exports.getAssetQuantity = (ps_id, symbol, callback) => {
  const sql = 'SELECT quantity FROM assets WHERE ps_id = ? AND symbol = ?';
  db.query(sql, [ps_id, symbol], callback);
};

exports.removeAsset = (ps_id, symbol, callback) => {
  const sql = 'DELETE FROM assets WHERE ps_id = ? AND symbol = ?';
  db.query(sql, [ps_id, symbol], callback);
};

exports.updateAssetQuantity = (newQty, ps_id, symbol, callback) => {
  const sql = 'UPDATE assets SET quantity = ? WHERE ps_id = ? AND symbol = ?';
  db.query(sql, [newQty, ps_id, symbol], callback);
};

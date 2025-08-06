const db = require('./db');

exports.createUser = (ps_id, callback) => {
  const sql = 'INSERT INTO users (ps_id) VALUES (?)';
  db.query(sql, [ps_id], callback);
};

exports.userExists = (ps_id, callback) => {
  const sql = 'SELECT * FROM users WHERE ps_id = ?';
  db.query(sql, [ps_id], callback);
};
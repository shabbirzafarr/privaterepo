const userModel = require('../models/userModel');

exports.addUser = (req, res) => {
  const { ps_id } = req.body;
  if (!ps_id) return res.status(400).json({ error: 'ps_id is required' });

  userModel.userExists(ps_id, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });

    // If the user already exists, respond and stop execution
    if (results.length > 0) {
      return res.json({ message: 'User already exists' });
    }

    // If the user does not exist, create a new user
    userModel.createUser(ps_id, (err2) => {
      if (err2) return res.json({ error: 'Something went wrong' });
      return res.json({ message: 'User created successfully' });
    });
  });
};

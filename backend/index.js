const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const assetRoutes = require('./routes/assetRoutes');
const yahooRoutes = require('./routes/yahooRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/assets', assetRoutes);
app.use('/api/yahoo', yahooRoutes);
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
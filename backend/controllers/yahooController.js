const { searchStock, getQuote, getCompanySummary, getHistoricalData } = require('../utils/yahooFinance');

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const data = await searchStock(q);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

exports.quote = async (req, res) => {
  try {
    const { symbol } = req.query;
    const quote = await getQuote(symbol);
    const profile = await getCompanySummary(symbol);
    const historical = await getHistoricalData(symbol);
    res.json({ quote, profile, historical });
  } catch (err) {
    res.status(500).json({ error: 'Quote fetch failed' });
  }
};

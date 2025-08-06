const { searchStock, getQuote, getCompanySummary, getHistoricalData } = require('../utils/yahooFinance');
const yahooFinance = require('yahoo-finance2').default
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const data = await searchStock(q);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};
exports.aboutCompany = async (req, res) => {
  try {
    const symbol = req.query.symbol || req.body?.symbol || req.params?.symbol;

    if (!symbol) {
      return res.status(400).json({ error: "Missing 'symbol' in query, body, or params" });
    }

    const quote = await yahooFinance.quote(symbol);

    res.json({ quote });
  } catch (err) {
    console.error('Error fetching company quote:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.historicalData = async (req, res) => {
  try {
    const symbol = req.query.symbol || req.body?.symbol || req.params?.symbol;

    if (!symbol) {
      return res.status(400).json({ error: "Missing 'symbol' in query, body, or params" });
    }

    const {
      period1,
      period2,
      interval = '1d', // Default to daily data
      events,           // Optional: dividends/splits
      includeAdjustedClose = true,
    } = req.query;

    // Build options dynamically
    const options = {
      period1: period1 || undefined,
      period2: period2 || undefined,
      interval,
      events,
      includeAdjustedClose: includeAdjustedClose === 'true',
    };

    const historical = await yahooFinance.historical(symbol, options);

    res.json({ historical });
  } catch (err) {
    console.error('Error fetching historical data:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.price = async (req, res) => {
  try {
    // Safely extract symbol from query/body/params
    const symbol = req.query.symbol || req.body?.symbol || req.params?.symbol;

    // Handle missing symbol
    if (!symbol) {
      return res.status(400).json({ error: "Missing 'symbol' in query or body or params" });
    }

    // Fetch quote
    const quotes = await yahooFinance.quote(symbol); // Yahoo Finance handles both string or array

    // Prepare result
    const priceMap = new Map();
    (Array.isArray(quotes) ? quotes : [quotes]).forEach((q) => {
      if (q.symbol && q.regularMarketPrice)
        priceMap.set(q.symbol, q.regularMarketPrice);
    });

    // Return price
    res.json(Object.fromEntries(priceMap));
  } catch (err) {
    console.error('Error fetching price:', err);
    res.status(500).json({ error: err.message });
  }
};

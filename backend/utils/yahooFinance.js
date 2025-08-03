const axios = require('axios');

exports.searchStock = async (query) => {
  const res = await axios.get(`https://query1.finance.yahoo.com/v1/finance/search?q=${query}`);
  return res.data;
};

exports.getQuote = async (symbol) => {
  const res = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
  return res.data.quoteResponse.result[0];
};

exports.getCompanySummary = async (symbol) => {
  const res = await axios.get(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=assetProfile`);
  return res.data.quoteSummary.result[0].assetProfile;
};

exports.getHistoricalData = async (symbol) => {
  const res = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`);
  return res.data.chart.result[0];
};

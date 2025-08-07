import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const formatMarketCap = (cap) => {
  if (cap >= 1e12) return (cap / 1e12).toFixed(2) + ' T';
  if (cap >= 1e9) return (cap / 1e9).toFixed(2) + ' B';
  if (cap >= 1e6) return (cap / 1e6).toFixed(2) + ' M';
  return cap;
};

const CompanyDetails = () => {
  const { ps_id, symbol } = useParams();
  const [company, setCompany] = useState(null);
  const [history, setHistory] = useState([]);
  const [interval, setInterval] = useState('1mo');
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/yahoo/about?symbol=${symbol}`);
        setCompany(res.data.quote);
      } catch (err) {
        console.error("Failed to fetch company details:", err.message);
      }
    };

    fetchCompany();
  }, [symbol]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const period1 = format(startDate, 'yyyy-MM-dd');
        const period2 = format(endDate, 'yyyy-MM-dd');
        const res = await axios.get(
          `http://localhost:3000/api/yahoo/history?symbol=${symbol}&period1=${period1}&period2=${period2}&interval=${interval}`
        );
        setHistory(res.data.historical);
      } catch (err) {
        console.error("Failed to fetch historical data:", err.message);
      }
    };

    fetchHistory();
  }, [symbol, interval, startDate, endDate]);

  const handleBuy = async () => {
    try {
      await axios.post('http://localhost:3000/api/assets/buy', {
        ps_id,
        symbol,
        company_name: company.shortName,
        quantity: parseInt(quantity),
        purchase_price: company.regularMarketPrice,
      });
      toast.success('Asset bought successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to buy asset');
    }
  };

  const handleSell = async () => {
    try {
      await axios.post('http://localhost:3000/api/assets/sell', {
        ps_id,
        symbol,
        quantity: parseInt(quantity),
      });
      toast.success('Asset sold successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to sell asset');
    }
  };

  const chartData = {
    labels: history.map((d) => d.date),
    datasets: [
      {
        label: `Closing Price (${interval})`,
        data: history.map((d) => d.close),
        fill: false,
        borderColor: 'limegreen',
        backgroundColor: 'limegreen',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-green-500">Company Details</h1>

      {company ? (
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
          <div className="text-2xl font-semibold text-white">
            {company.shortName} <span className="text-green-400">({company.symbol})</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div><span className="text-green-500 font-medium">Current Price:</span> ₹{company.regularMarketPrice}</div>
            <div><span className="text-green-500 font-medium">Currency:</span> {company.currency}</div>
            <div><span className="text-green-500 font-medium">Market Cap:</span> {formatMarketCap(company.marketCap)}</div>
            <div><span className="text-green-500 font-medium">Exchange:</span> {company.fullExchangeName || 'N/A'}</div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <input
              type="number"
              className="bg-black border border-green-500 px-4 py-2 rounded text-white placeholder-gray-500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
            />
            <button
              onClick={handleBuy}
              className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-white"
            >
              Buy
            </button>
            <button
              onClick={handleSell}
              className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-white"
            >
              Sell
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Loading company info...</p>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-green-400">Stock Performance</h2>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white">
          <label>
            Interval:
            <select
              className="ml-2 bg-black border border-green-500 rounded px-3 py-1 text-white"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            >
              <option value="1d">1 Day</option>
              <option value="1wk">1 Week</option>
              <option value="1mo">1 Month</option>
            </select>
          </label>

          <label>
            From:
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="ml-2 bg-black border border-green-500 text-white px-3 py-1 rounded"
              dateFormat="yyyy-MM-dd"
            />
          </label>

          <label>
            To:
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="ml-2 bg-black border border-green-500 text-white px-3 py-1 rounded"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
            />
          </label>
        </div>

        {history.length > 0 ? (
          <div className="bg-gray-900 p-4 rounded-lg shadow">
            <Line data={chartData} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">No historical data available.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;

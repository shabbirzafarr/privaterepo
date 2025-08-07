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

  const chartData = {
    labels: history.map((d) => d.date),
    datasets: [
      {
        label: `Closing Price (${interval})`,
        data: history.map((d) => d.close),
        fill: false,
        borderColor: 'rgb(59,130,246)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Company Details</h1>

      {company ? (
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <div className="text-xl font-semibold">{company.shortName} ({company.symbol})</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Current Price:</strong> ₹{company.regularMarketPrice}</div>
            <div><strong>Currency:</strong> {company.currency}</div>
            <div><strong>Market Cap:</strong> {formatMarketCap(company.marketCap)}</div>
            <div><strong>Exchange:</strong> {company.fullExchangeName || 'N/A'}</div>
          </div>
        </div>
      ) : (
        <p>Loading company info...</p>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-2">Stock Performance</h2>

        <div className="flex gap-4 items-center mb-4">
          <label>
            Interval:
            <select
              className="ml-2 border rounded px-2 py-1"
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
              className="ml-2 border rounded px-2 py-1"
              dateFormat="yyyy-MM-dd"
            />
          </label>

          <label>
            To:
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="ml-2 border rounded px-2 py-1"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
            />
          </label>
        </div>

        {history.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p className="text-sm text-gray-500 mt-2">No historical data available.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;

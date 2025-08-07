import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PortfolioTable = ({ psId }) => {
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3000/api/assets?ps_id=${psId}`).then((res) => {
      setAssets(res.data);

      Promise.all(
        res.data.map((asset) => {
          const symbol = asset.symbol?.trim().toUpperCase();
          return axios
            .get(`http://localhost:3000/api/yahoo/price?symbol=${symbol}`)
            .then((r) => {
              const price = r.data?.[symbol];
              return { symbol, price };
            })
            .catch(() => {
              return { symbol, price: null };
            });
        })
      ).then((results) => {
        const priceMap = {};
        results.forEach(({ symbol, price }) => {
          priceMap[symbol] = price;
        });
        setPrices(priceMap);
      });
    });
  }, [psId]);

  const chartData = {
    labels: assets.map((a) => a.symbol),
    datasets: [
      {
        label: 'Quantity',
        data: assets.map((a) => a.quantity),
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // greenish
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl text-gray-800">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-900">Your Portfolio</h2>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 uppercase text-xs text-gray-600">
              <th className="py-3 px-4 text-left">Company</th>
              <th className="py-3 px-4 text-left">Symbol</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, index) => (
              <tr
                key={a.symbol}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition`}
              >
                <td className="py-3 px-4 font-medium text-gray-900">{a.company_name}</td>
                <td className="py-3 px-4">{a.symbol}</td>
                <td className="py-3 px-4">{a.quantity}</td>
                <td className="py-3 px-4">
                  {prices[a.symbol] !== null ? prices[a.symbol] : 'Unavailable'}
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-4 rounded-lg text-sm shadow-md transition duration-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Buy
                  </button>
                  <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-4 rounded-lg text-sm shadow-md transition duration-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      {assets.length > 0 && (
        <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Quantity by Company</h3>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: '#374151', // dark gray
                    font: {
                      size: 14,
                    },
                  },
                },
                tooltip: {
                  backgroundColor: '#111827',
                  titleColor: '#f9fafb',
                  bodyColor: '#e5e7eb',
                  titleFont: {
                    size: 16,
                  },
                  bodyFont: {
                    size: 14,
                  },
                  padding: 10,
                },
              },
              scales: {
                x: {
                  ticks: { color: '#374151', font: { size: 12 } },
                  grid: { color: 'rgba(0,0,0,0.05)' },
                },
                y: {
                  ticks: { color: '#374151', font: { size: 12 } },
                  grid: { color: 'rgba(0,0,0,0.05)' },
                },
              },
            }}
          />
        </div>
      )}  
    </div>
  );
};

export default PortfolioTable;
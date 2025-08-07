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
import { toast } from 'react-toastify';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PortfolioTable = ({ psId }) => {
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [quantity, setQuantity] = useState('');

  const fetchAssets = () => {
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
  };

  useEffect(() => {
    fetchAssets();
  }, [psId]);

  const handleBuySellClick = (action, asset) => {
    setSelectedAction(action);
    setSelectedAsset(asset);
    setQuantity('');
  };

  const closeDialog = () => {
    setSelectedAction(null);
    setSelectedAsset(null);
    setQuantity('');
  };

  const handleSubmit = async () => {
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity.');
      return;
    }

    try {
      if (selectedAction === 'buy') {
        const price = prices[selectedAsset.symbol] ?? 0;

        await axios.post('http://localhost:3000/api/assets/buy', {
          ps_id: psId,
          symbol: selectedAsset.symbol,
          company_name: selectedAsset.company_name,
          quantity: parseInt(quantity),
          purchase_price: price,
        });

        toast.success('Asset bought successfully');
      } else {
        await axios.post('http://localhost:3000/api/assets/sell', {
          ps_id: psId,
          symbol: selectedAsset.symbol,
          quantity: parseInt(quantity),
        });

        toast.success('Asset sold successfully');
      }

      closeDialog();
      fetchAssets();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transaction failed');
      console.error(error);
    }
  };

  const chartData = {
    labels: assets.map((a) => a.symbol),
    datasets: [
      {
        label: 'Quantity',
        data: assets.map((a) => a.quantity),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: 'easeInOutCubic',
    },
    plugins: {
      legend: {
        labels: {
          color: '#374151',
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
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
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl text-gray-800 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-900">Your Portfolio</h2>

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
                  {prices[a.symbol] !== null ? `₹${prices[a.symbol]}` : 'Unavailable'}
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleBuySellClick('buy', a)}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-4 rounded-lg text-sm shadow-md transition duration-200"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => handleBuySellClick('sell', a)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-4 rounded-lg text-sm shadow-md transition duration-200"
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {assets.length > 0 && (
        <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Quantity by Company</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Buy/Sell Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {selectedAction} {selectedAsset.symbol}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDialog}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTable;

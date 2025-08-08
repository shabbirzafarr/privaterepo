import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Title
);

const PortfolioTable = ({ psId }) => {
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [refreshCountdown, setRefreshCountdown] = useState(2);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    const fetchAssets = () => {
      axios.get(`http://localhost:3000/api/assets?ps_id=${psId}`).then((res) => {
        setAssets(res.data);
      });
    };
    fetchAssets();
  }, [psId]);

  useEffect(() => {
    const fetchPrices = () => {
      if (!assets.length) return;

      Promise.all(
        assets.map((asset) => {
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
    };

    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, 2000);
    countdownRef.current = setInterval(() => {
      setRefreshCountdown((prev) => (prev === 1 ? 2 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, [assets]);

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
      axios.get(`http://localhost:3000/api/assets?ps_id=${psId}`).then((res) => {
        setAssets(res.data);
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transaction failed');
    }
  };

  const totalPL = assets.reduce((acc, a) => {
    const price = prices[a.symbol];
    if (price !== null) {
      return acc + (price - a.purchase_price) * a.quantity;
    }
    return acc;
  }, 0);

  const barChartData = {
    labels: assets.map((a) => a.symbol),
    datasets: [
      {
        label: 'Quantity',
        data: assets.map((a) => a.quantity),
        backgroundColor: 'rgba(0,255,0,0.6)',
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const pieChartData = {
    labels: assets.map((a) => a.symbol),
    datasets: [
      {
        label: 'Holdings',
        data: assets.map((a) => prices[a.symbol] * a.quantity),
        backgroundColor: [
          '#16a34a',
          '#22c55e',
          '#4ade80',
          '#86efac',
          '#bbf7d0',
          '#ecfccb',
        ],
      },
    ],
  };

  return (
    <div className="bg-black text-white p-6 rounded-xl shadow-xl max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Your Portfolio</h2>
      <p className="mb-4 text-sm text-gray-400">Live prices refresh in {refreshCountdown}s</p>
      <p className="mb-6 text-md font-medium">
        Total Profit/Loss:{' '}
        <span className={totalPL >= 0 ? 'text-green-400' : 'text-red-400'}>
          ₹{totalPL.toFixed(2)}
        </span>
      </p>

      <div className="overflow-x-auto rounded-xl mb-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Symbol</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Live Price</th>
              <th className="py-3 px-4">Profit/Loss</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => {
              const currentPrice = prices[a.symbol];
              const pl =
                currentPrice !== null
                  ? ((currentPrice - a.purchase_price) * a.quantity).toFixed(2)
                  : null;
              return (
                <tr key={a.symbol} className={i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                  <td className="py-2 px-4">{a.company_name}</td>
                  <td className="py-2 px-4">{a.symbol}</td>
                  <td className="py-2 px-4">{a.quantity}</td>
                  <td className="py-2 px-4">
                    {currentPrice !== null ? `₹${currentPrice}` : 'Unavailable'}
                  </td>
                  <td className="py-2 px-4">
                    {pl !== null ? (
                      <span className={pl >= 0 ? 'text-green-400' : 'text-red-400'}>₹{pl}</span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleBuySellClick('buy', a)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleBuySellClick('sell', a)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Quantity Overview</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Holdings Value Distribution</h3>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 w-96 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {selectedAction} {selectedAsset.symbol}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={closeDialog} className="px-4 py-2 bg-gray-300 rounded-lg">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
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

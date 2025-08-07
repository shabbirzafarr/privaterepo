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
      console.log("✅ Assets fetched:", res.data);
  
      Promise.all(
        res.data.map((asset) => {
          const symbol = asset.symbol?.trim().toUpperCase();
          return axios
            .get(`http://localhost:3000/api/yahoo/price?symbol=${symbol}`)
            .then((r) => {
              const price = r.data?.[symbol]; // ✅ Match your backend's format
              console.log(`✔ ${symbol} price:`, price);
              return { symbol, price };
            })
            .catch((e) => {
              console.error(`❌ Fetch failed for ${symbol}:`, e.message);
              return { symbol, price: null };
            });
        })
      ).then((results) => {
        const priceMap = {};
        results.forEach(({ symbol, price }) => {
          priceMap[symbol] = price;
        });
        console.log("✅ Final price map:", priceMap);
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
        backgroundColor: 'rgba(59,130,246,0.5)',
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
      <table className="w-full text-left border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Company</th>
            <th className="p-2">Symbol</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.symbol} className="border-t">
              <td className="p-2">{a.company_name}</td>
              <td className="p-2">{a.symbol}</td>
              <td className="p-2">{a.quantity}</td>
              <td className="p-2">{prices[a.symbol] ?? 'Fetching failed'}</td>

            </tr>
          ))}
        </tbody>
      </table>

      {assets.length > 0 && (
        <div className="mt-8">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

export default PortfolioTable;

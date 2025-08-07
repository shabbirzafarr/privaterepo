import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BuySellDialog = ({ isOpen, onClose, action, psId, symbol, companyName }) => {
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const handleSubmit = async () => {
    try {
      if (action === 'buy') {
        const res = await axios.post('http://localhost:3000/api/assets/buy', {
          ps_id: psId,
          symbol,
          company_name: companyName,
          quantity,
          purchase_price: purchasePrice,
        });

        toast.success(res.data.message);
      } else if (action === 'sell') {
        const res = await axios.post('http://localhost:3000/api/assets/sell', {
          ps_id: psId,
          symbol,
          quantity,
        });

        toast.success(res.data.message);
      }

      onClose();
    } catch (error) {
      const message = error?.response?.data?.error || 'Something went wrong';
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {action === 'buy' ? 'Buy' : 'Sell'} {companyName} ({symbol})
        </h2>

        <input
          type="number"
          className="w-full border p-2 rounded mb-3"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {action === 'buy' && (
          <input
            type="number"
            className="w-full border p-2 rounded mb-3"
            placeholder="Purchase Price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {action === 'buy' ? 'Buy' : 'Sell'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellDialog;

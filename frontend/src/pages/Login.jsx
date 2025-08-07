import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [psId, setPsId] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!psId) {
      toast.error('PS ID is required!');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ps_id: psId }),
      });

      const data = await res.json();

      if (data.message === 'User created successfully' || data.message === 'User already exists') {
        toast.success(data.message);
        setTimeout(() => navigate(`/home/${psId}`), 1000); // navigate after short delay
      } else {
        toast.error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      toast.error('Server not reachable');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded">
        <input
          type="text"
          placeholder="Enter PS ID"
          value={psId}
          onChange={(e) => setPsId(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Enter</button>
      </div>
    </div>
  );
};

export default Login;

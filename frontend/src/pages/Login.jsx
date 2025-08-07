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

      if (
        data.message === 'User created successfully' ||
        data.message === 'User already exists'
      ) {
        toast.success(data.message);
        setTimeout(() => navigate(`/home/${psId}`), 1000);
      } else {
        toast.error(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      toast.error('Server not reachable');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Image with Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
            url('https://media.istockphoto.com/id/1397855482/photo/business-financial-investment.jpg?s=612x612&w=0&k=20&c=7GDFknE-Ecn5Pe_00ID50u_ZbNtfLdbD-pcd3cTRybY=')`,
        }}
      ></div>

      {/* Login Box - Glassmorphic Style */}
      <div className="z-10 backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow">
          Welcome Back
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter PS ID"
            value={psId}
            onChange={(e) => setPsId(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md hover:shadow-xl"
          >
            Enter
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-300">
          Enter your PS ID to continue to the dashboard.
        </p>
      </div>
    </div>
  );
};

export default Login;

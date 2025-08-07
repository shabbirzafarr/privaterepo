import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/:ps_id" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

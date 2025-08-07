import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Home from './pages/Home';
import CompanyDetails from './pages/CompanyDetails';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/:ps_id" element={<Home />} />
        <Route path="/company/:ps_id/:symbol" element={<CompanyDetails />} />
        
      </Routes>

    </BrowserRouter>
  );
}

export default App;

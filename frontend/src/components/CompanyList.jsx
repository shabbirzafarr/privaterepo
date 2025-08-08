import { useNavigate } from 'react-router-dom';
import { TrendingUp, Briefcase, BarChart3, Info, Star } from 'lucide-react';

const companies = [
  { name: 'Infosys', symbol: 'INFY.NS', marketCap: 6300000000000, sector: 'IT Services', headquarters: 'Bengaluru' },
  { name: 'Tata Consultancy Services', symbol: 'TCS.NS', marketCap: 13700000000000, sector: 'IT Services', headquarters: 'Mumbai' },
  { name: 'Larsen & Toubro', symbol: 'LT.NS', marketCap: 5200000000000, sector: 'Engineering', headquarters: 'Mumbai' },
  { name: 'State Bank of India', symbol: 'SBIN.NS', marketCap: 7000000000000, sector: 'Banking', headquarters: 'Mumbai' },
];

const CompanyList = ({ psId }) => {
  const navigate = useNavigate();

  const handleClick = (symbol) => {
    navigate(`/company/${psId}/${symbol}`);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-6 py-6 space-y-8 overflow-y-auto">
      {/* Header */}
      <div className="text-green-400 text-2xl font-bold flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        NSE Company Explorer
      </div>

      {/* NSE Companies */}
      <div>
        <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-400" />
          Top NSE-Listed Companies
        </h2>
        <div className="grid gap-4">
          {companies.map((company, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(company.symbol)}
              className="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 cursor-pointer transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">{company.name}</h3>
                <Briefcase className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-sm text-gray-400">{company.symbol}</p>
              <p className="text-xs text-gray-500">Sector: {company.sector}</p>
              <p className="text-xs text-gray-500">HQ: {company.headquarters}</p>
              <p className="text-xs text-gray-500">
                Market Cap: ₹{(company.marketCap / 1e12).toFixed(2)}T
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Section */}
      
    </div>
  );
};

export default CompanyList;

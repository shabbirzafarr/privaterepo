import { useNavigate } from 'react-router-dom';

const companies = [
  { name: 'Apple Inc.', symbol: 'AAPL', marketCap: 2800000000000 },
  { name: 'Google LLC', symbol: 'GOOGL', marketCap: 1950000000000 },
  { name: 'Amazon', symbol: 'AMZN', marketCap: 1850000000000 },
  { name: 'Microsoft Corp.', symbol: 'MSFT', marketCap: 3100000000000 },
  { name: 'Tesla Inc.', symbol: 'TSLA', marketCap: 900000000000 },
];

// Sort by market cap (descending)
const sortedCompanies = companies.sort((a, b) => b.marketCap - a.marketCap);

const CompanyList = ({ psId }) => {
  const navigate = useNavigate();

  const handleCompanyClick = (symbol) => {
    navigate(`/company/${psId}/${symbol}`);
  };

  return (
    <div className="space-y-4">
      {sortedCompanies.map((company, index) => (
        <div
          key={index}
          onClick={() => handleCompanyClick(company.symbol)}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
          <p className="text-sm text-gray-500">{company.symbol}</p>
          <p className="text-xs text-gray-400">
            Market Cap: ${company.marketCap.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};


export default CompanyList;
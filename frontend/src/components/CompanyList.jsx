const companies = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
  ];
  
  const CompanyList = () => (
    <div>
      <h2 className="text-lg font-bold mb-2">Company List</h2>
      {companies.map((c) => (
        <div key={c.symbol} className="border-b py-2">
          <div className="font-semibold">{c.name}</div>
          <div className="text-sm text-gray-600">{c.symbol}</div>
        </div>
      ))}
    </div>
  );
  
  export default CompanyList;
  
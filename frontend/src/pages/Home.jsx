import { useParams } from 'react-router-dom';
import CompanyList from '../components/CompanyList';
import PortfolioTable from '../components/PortfolioTable';

const Home = () => {
  const { ps_id } = useParams();

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: `
          linear-gradient(to bottom right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
          url('/cfb53260-52fb-4603-9f6d-2f9b0ab45578.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Sidebar - Company List */}
      <aside className="w-1/3 max-w-sm p-6 backdrop-blur-lg bg-white/10 border-r border-white/20 text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 tracking-wide border-b border-white/20 pb-2">
          Company List
        </h2>
        <div className="h-[80vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
        <CompanyList psId={ps_id} />
        </div>
      </aside>

      {/* Main - Portfolio Table */}
      <main className="flex-1 p-8 backdrop-blur-lg bg-white/10 text-white shadow-2xl overflow-y-auto">
        <div className="mb-6 border-b border-white/20 pb-2">
          <h2 className="text-3xl font-bold tracking-wide">Your Portfolio</h2>
          <p className="text-sm text-gray-300 mt-1">PS ID: {ps_id}</p>
        </div>
        <PortfolioTable psId={ps_id} />
      </main>
    </div>
  );
};

export default Home;
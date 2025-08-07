import { useParams } from 'react-router-dom';
import CompanyList from '../components/CompanyList';
import PortfolioTable from '../components/PortfolioTable';
import { motion } from 'framer-motion';

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
      <motion.aside
        className="w-1/3 max-w-sm p-6 backdrop-blur-lg bg-white/10 border-r border-white/20 text-white shadow-2xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="h-[90vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
          <CompanyList psId={ps_id} />
        </div>
      </motion.aside>

      {/* Main - Portfolio Table */}
      <motion.main
        className="flex-1 p-8 backdrop-blur-lg bg-white/10 text-white shadow-2xl overflow-y-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <PortfolioTable psId={ps_id} />
      </motion.main>
    </div>
  );
};

export default Home;

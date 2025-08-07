import { useParams } from 'react-router-dom';
import CompanyList from '../components/CompanyList';
import PortfolioTable from '../components/PortfolioTable';

const Home = () => {
  const { ps_id } = useParams();

  return (
    <div className="flex h-screen">
      <div className="w-[30%] bg-gray-100 p-4 overflow-y-auto">
        <CompanyList />
      </div>
      <div className="w-[70%] p-4 overflow-y-auto">
        <PortfolioTable psId={ps_id} />
      </div>
    </div>
  );
};

export default Home;

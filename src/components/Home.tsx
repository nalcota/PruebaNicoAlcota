import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Gestión de Desarrolladores y Proyectos</h1>
      <div className="flex gap-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
          onClick={() => navigate('/desarrolladores')}
        >
          Desarrolladores
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
          onClick={() => navigate('/proyectos')}
        >
          Proyectos
        </Button>
      </div>
    </div>
  );
};

export default Home;

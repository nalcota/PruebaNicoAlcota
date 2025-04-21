import { useState } from 'react';
import '../../index.css';
import ModalCrearProyecto from './ModalCrearProyectos';
import { Button } from '@/components/ui/button';
import { useProyectosQuery } from '../../api/useProyectosQuery';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDesarrolladoresQuery } from '@/api/useDesarrolladoresQuery';
import { useDesarrolladoresPorProyectoCantidadQuery } from '@/api/useDesarrolladoresPorProyectosCantidadQuery';
import ModalAsignarDesarrolladores from './ModalAsignarDesarrolladores';
import { format } from 'date-fns';
import ModalVerDetallesProyecto from './ModalVerDetallesProyecto';
import { startOfYear, endOfYear } from 'date-fns';
import { parse } from 'date-fns'


interface ProyectosProps {
  token: string;
}

const Proyectos: React.FC<ProyectosProps> = ({ token }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: proyectos, isLoading, isError, refetch } = useProyectosQuery();
  const { data: desarrolladoresData, isLoading: isLoadingDesarrolladores, error: errorDesarrolladores } = useDesarrolladoresQuery();
  const { data: desarrolladoresDataPorProyectosCantidad, isLoading: _isLoadingDesarrolladoresPorProyectosCantidad, error: errorDesarrolladoresPorProyectosCantidad } = useDesarrolladoresPorProyectoCantidadQuery();
  const [isModalAsignarOpen, setIsModalAsignarOpen] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [proyectoEnEdicion, setProyectoEnEdicion] = useState(null);
  const [isModalVerDetallesOpen, setIsModalVerDetallesOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState(startOfYear(new Date()));
  const [fechaTerminoFiltro, setFechaTerminoFiltro] = useState(endOfYear(new Date()));

  const toggleCheckbox = (codigoDesarrollador: string) => {
    const newSet = new Set(seleccionados);

    if (newSet.has(codigoDesarrollador)) {
      newSet.delete(codigoDesarrollador);
    } else {
      newSet.add(codigoDesarrollador);
    }


    setSeleccionados(newSet);
  };


  const handleGuardarAsignacion = () => {
    setIsModalAsignarOpen(false);
  };

  // Función para formatear las fechas por la zona horaria tuve problemas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };
  const handleSubmit = (data: any) => {
    console.log("Proyecto creado:", data);
    refetch();
  };

  if (isLoading) return <p className="text-center">Cargando proyectos...</p>;
  if (isError) return <p className="text-center">Error al cargar los proyectos.</p>;
  if (isLoadingDesarrolladores) return <div className="text-center mt-10">Cargando...</div>;
  if (errorDesarrolladores) return <div className="text-center mt-10 text-red-500">Error al cargar datos</div>;
  if (errorDesarrolladoresPorProyectosCantidad) return <div className="text-center mt-10 text-red-500">Error al cargar datos</div>;


  const eliminarProyecto = async (codigoProyecto: string) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivara el proyecto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`https://apipruebas.rbu.cl/api/proyectos/${codigoProyecto}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          }
        });

        Swal.fire({
          title: 'Desactivado!',
          text: 'El proyecto ha sido desactivado correctamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload();
        });

      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al desactivar el proyecto.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const verDetallesProyecto = (proyecto: any) => {
    setProyectoSeleccionado(proyecto);
    setIsModalVerDetallesOpen(true);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Proyectos</h1>
      <p className="mb-6 text-center text-gray-700">Listado de Proyectos</p>

      <div className="mb-4 text-center flex justify-center gap-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
        >
          Crear Proyecto
        </Button>
        <Button
          onClick={() => navigate('/proyectos_desactivados')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
        >
          Ver Proyectos Desactivados
        </Button>

      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm w-1/2 focus:outline-none focus:ring focus:border-blue-300"
          />

        <div className="flex gap-2 items-end ml-[450px]">
          <div>
            <label className="block text-xs font-medium text-gray-700">Fecha Inicio</label>
            <input
              type="date"
              value={format(fechaInicioFiltro, 'yyyy-MM-dd')}
              onChange={(e) => {
                const parsed = parse(e.target.value, 'yyyy-MM-dd', new Date());
                setFechaInicioFiltro(parsed);
              }}
              className="px-4 py-2 border border-gray-300 rounded text-sm w-[180px]"
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Fecha Término</label>
            <input
              type="date"
              value={format(fechaTerminoFiltro, 'yyyy-MM-dd')}
              onChange={(e) => {
                const parsed = parse(e.target.value, 'yyyy-MM-dd', new Date());
                setFechaTerminoFiltro(parsed);
              }}
              className="px-4 py-2 border border-gray-300 rounded text-sm w-[180px]"
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>



      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full w-full border-collapse bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Nombre de proyecto</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Fecha de inicio</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Fecha de término</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Cantidad de desarrolladores asignados
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos
              .filter((proyecto: any) => {
                const fechaInicioProyecto = new Date(proyecto.fechaInicio);
                const fechaTerminoProyecto = new Date(proyecto.fechaTermino);

                return (
                  proyecto.registroActivo &&
                  proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
                  fechaInicioProyecto >= fechaInicioFiltro &&
                  fechaTerminoProyecto <= fechaTerminoFiltro
                );
              })
              .map((proyecto: any) => (<tr key={proyecto.codigoProyecto} className="border-t hover:bg-gray-50 transition-all duration-300">
                <td className="px-6 py-4 text-sm text-gray-800">{proyecto.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{formatDate(proyecto.fechaInicio)}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{formatDate(proyecto.fechaTermino)}</td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center w-1/6">
                  {
                    desarrolladoresDataPorProyectosCantidad?.find(
                      (p: any) => p.codigoProyecto === proyecto.codigoProyecto
                    )?.cantidadDesarrolladores ?? '0'
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {proyecto.registroActivo ? 'Activo' : 'Inactivo'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 space-x-1 w-1/3">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"
                    onClick={() => verDetallesProyecto(proyecto)}
                  >
                    Ver detalles
                  </button>

                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm cursor-pointer"
                    onClick={() => {
                      setProyectoEnEdicion(proyecto); // Enviar datos al modal
                      setIsModalOpen(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
                    onClick={() => eliminarProyecto(proyecto.codigoProyecto)}
                  >
                    Desactivar
                  </button>


                  <button
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm cursor-pointer"
                    onClick={() => {
                      setProyectoSeleccionado(proyecto.codigoProyecto);
                      setIsModalAsignarOpen(true);
                    }}
                  >
                    Asignar Desarrolladores
                  </button>

                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ModalCrearProyecto
        onSubmit={handleSubmit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proyectoInicial={proyectoEnEdicion}
        token={token}
      />
      <ModalAsignarDesarrolladores
        isOpen={isModalAsignarOpen}
        onClose={() => setIsModalAsignarOpen(false)}
        desarrolladores={desarrolladoresData}
        seleccionados={seleccionados}
        toggleCheckbox={toggleCheckbox}
        handleGuardar={handleGuardarAsignacion}
        proyectoSeleccionado={proyectoSeleccionado}

      />
      <ModalVerDetallesProyecto
        isOpen={isModalVerDetallesOpen}
        onClose={() => setIsModalVerDetallesOpen(false)}
        proyectoData={proyectoSeleccionado}
        token={token}

      />
    </div>
  );
};

export default Proyectos;

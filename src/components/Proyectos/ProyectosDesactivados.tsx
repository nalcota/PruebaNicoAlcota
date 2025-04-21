import { useState } from 'react';
import '../../index.css';
import { Button } from '@/components/ui/button';
import { useProyectosQuery } from '../../api/useProyectosQuery';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ModalVerDetallesProyecto from './ModalVerDetallesProyecto';
import { useDesarrolladoresPorProyectoCantidadQuery } from '@/api/useDesarrolladoresPorProyectosCantidadQuery';


interface ProyectosDesactivadosProps {
    token: string;
  }
  const ProyectosDesactivados: React.FC<ProyectosDesactivadosProps> = ({ token }) => {
    const navigate = useNavigate();
    const { data: proyectos, isLoading, isError } = useProyectosQuery();
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [isModalVerDetallesOpen, setIsModalVerDetallesOpen] = useState(false);
    const { data: desarrolladoresDataPorProyectosCantidad, isLoading: _isLoadingDesarrolladoresPorProyectosCantidad, error: _errorDesarrolladoresPorProyectosCantidad } = useDesarrolladoresPorProyectoCantidadQuery();
    const [busqueda, setBusqueda] = useState('');

    // funcion para formatear fechas
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };



    if (isLoading) return <p className="text-center">Cargando proyectos...</p>;
    if (isError) return <p className="text-center">Error al cargar los proyectos.</p>;

    const reactivarProyecto = async (codigoProyecto: string) => {
        const confirmacion = await Swal.fire({
            title: '¿Reactivar proyecto?',
            text: '¿Estás seguro que deseas reactivar este proyecto?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, reactivar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await axios.put(`https://apipruebas.rbu.cl/api/proyectos/${codigoProyecto}/reactivar`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                });

                await Swal.fire({
                    title: '¡Reactivado!',
                    text: 'El proyecto ha sido reactivado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });

                window.location.reload(); 
            } catch (error) {
                console.error('Error al reactivar el proyecto:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo reactivar el proyecto.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
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
            <p className="mb-6 text-center text-gray-700">Listado de Proyectos Desactivados</p>

            <div className="mb-4 text-center">
                <Button
                    onClick={() => navigate('/proyectos')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                    Volver
                </Button>
            </div>
            <div className="mb-4 text-center">
                <input
                    type="text"
                    placeholder="Buscar Proyecto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded shadow-sm w-1/2 focus:outline-none focus:ring focus:border-blue-300"
                />
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
                            .filter((proyecto: any) =>
                                !proyecto.registroActivo &&
                                (
                                    proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase())
                                )
                            ).map((proyecto: any) => (
                                <tr key={proyecto.codigoProyecto} className="border-t hover:bg-gray-50 transition-all duration-300">
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
                                    <td className="px-6 py-4 text-sm text-gray-800 space-x-1">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"
                                            onClick={() => verDetallesProyecto(proyecto)}
                                        >
                                            Ver detalles
                                        </button>


                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                            onClick={() => reactivarProyecto(proyecto.codigoProyecto)}
                                        >
                                            Reactivar
                                        </button>

                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <ModalVerDetallesProyecto
                isOpen={isModalVerDetallesOpen}
                onClose={() => setIsModalVerDetallesOpen(false)}
                proyectoData={proyectoSeleccionado}
                token={token}

            />
        </div>
    );
};

export default ProyectosDesactivados;

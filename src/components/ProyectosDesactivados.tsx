import { useState } from 'react';
import '../index.css';
import ModalCrearProyecto from './ModalCrearProyectos';
import { Button } from '@/components/ui/button';
import { useProyectosQuery } from '../api/useProyectosQuery';

const ProyectosDesactivados = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: proyectos, isLoading, isError } = useProyectosQuery();

    // Función para formatear las fechas
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (isLoading) return <p className="text-center">Cargando proyectos...</p>;
    if (isError) return <p className="text-center">Error al cargar los proyectos.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Proyectos</h1>
            <p className="mb-6 text-center text-gray-700">Listado de Proyectos</p>

            <div className="mb-4 text-center">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Crear Proyecto
                </Button>
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
                            .filter((proyecto: any) => !proyecto.registroActivo) // Solo desactivados
                            .map((proyecto: any) => (
                                <tr key={proyecto.codigoProyecto} className="border-t hover:bg-gray-50 transition-all duration-300">
                                    <td className="px-6 py-4 text-sm text-gray-800">{proyecto.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{formatDate(proyecto.fechaInicio)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{formatDate(proyecto.fechaTermino)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {/* Si el campo de "cantidad de desarrolladores asignados" no viene de la API, puedes
                      colocar un valor predeterminado o implementarlo según tus necesidades */}
                                        N/A
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {proyecto.registroActivo ? 'Activo' : 'Inactivo'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 space-x-1">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                                            Ver detalles
                                        </button>
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                                            Editar
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                                            Eliminar
                                        </button>
                                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                                            Reactivar
                                        </button>
                                        <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm">
                                            Asignar a proyecto
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <ModalCrearProyecto isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ProyectosDesactivados;

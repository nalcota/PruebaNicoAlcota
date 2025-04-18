import { useState } from 'react';
import '../index.css';
import ModalCrearDesarrollador from './ModalCrearDesarrollador';
import { Button } from "@/components/ui/button"
import ModalCrearProyecto from './ModalCrearProyectos';

const Proyectos = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const data = [
        {
            id: 1,
            nombre: 'Ana Pérez',
            finicio: '2021-05-12',
            cdesarrolladores: 3,
            ftermino: '2021-05-12',
            añosExperiencia: 5,
            proyectosAsignados: 3,
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Luis González',
            finicio: '2021-05-12',
            cdesarrolladores: 3,
            ftermino: '2019-08-20',
            añosExperiencia: 6,
            proyectosAsignados: 2,
            estado: 'Inactivo'
        },
        {
            id: 3,
            nombre: 'Sofía Rodríguez',
            finicio: '2021-05-12',
            cdesarrolladores: 3,
            ftermino: '2020-03-15',
            añosExperiencia: 4,
            proyectosAsignados: 5,
            estado: 'Activo'
        },
    ];

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
                            <th className="px-6 py-3 text-left text-sm font-medium">Cantidad de desarrolladores asignados</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Estado</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((dev) => (
                            <tr key={dev.id} className="border-t hover:bg-gray-50 transition-all duration-300">
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.nombre}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.finicio}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.ftermino}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.cdesarrolladores}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.estado}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">
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
            <ModalCrearProyecto
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Proyectos;

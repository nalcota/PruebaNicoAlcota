import { useState } from 'react';
import '../index.css';
import ModalCrearDesarrollador from './ModalCrearDesarrollador';
import { Button } from "@/components/ui/button"

const DesarrolladoresDesactivados = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const data = [
        {
            id: 1,
            nombre: 'Ana Pérez',
            rut: '12.345.678-9',
            correo: 'ana.perez@example.com',
            fechaContratacion: '2021-05-12',
            añosExperiencia: 5,
            proyectosAsignados: 3,
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Luis González',
            rut: '98.765.432-1',
            correo: 'luis.gonzalez@example.com',
            fechaContratacion: '2019-08-20',
            añosExperiencia: 6,
            proyectosAsignados: 2,
            estado: 'Inactivo'
        },
        {
            id: 3,
            nombre: 'Sofía Rodríguez',
            rut: '23.456.789-0',
            correo: 'sofia.rodriguez@example.com',
            fechaContratacion: '2020-03-15',
            añosExperiencia: 4,
            proyectosAsignados: 5,
            estado: 'Activo'
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Desarrolladores</h1>
            <p className="mb-6 text-center text-gray-700">Listado de Desarrolladores Desactivados</p>

            <div className="mb-4 text-center">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Crear Desarrollador
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full w-full border-collapse bg-white">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">Nombre Completo</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">RUT</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Correo Electrónico</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Fecha de Contratación</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Años de Experiencia</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Proyectos Asignados</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Estado</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((dev) => (
                            <tr key={dev.id} className="border-t hover:bg-gray-50 transition-all duration-300">
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.nombre}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.rut}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.correo}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.fechaContratacion}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.añosExperiencia}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{dev.proyectosAsignados}</td>
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
            <ModalCrearDesarrollador
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default DesarrolladoresDesactivados;

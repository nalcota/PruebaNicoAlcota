import { useState } from 'react';
import '../index.css';
import ModalCrearDesarrollador from './ModalCrearDesarrollador';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useDesarrolladoresQuery } from '../api/useDesarrolladoresQuery';
import axios from 'axios';
import Swal from 'sweetalert2';

const DesarrolladoresDesactivados = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useDesarrolladoresQuery();

    if (isLoading) return <div className="text-center mt-10">Cargando...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">Error al cargar datos</div>;


    const handleSubmit = (data: any) => {
        console.log("Desarrollador creado:", data);
        refetch();
    };


    const activarDesarrollador = async (codigo: string) => {
        const confirmado = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas activar este desarrollador?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmado.isConfirmed) {
            try {
                await axios.put(
                    `https://apipruebas.rbu.cl/api/desarrolladores/${codigo}/reactivar`,
                    {}, // si la API no necesita body, se envía objeto vacío
                    {
                        headers: {
                            Authorization: 'Bearer T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9'
                        }
                    }
                );

                Swal.fire('¡Activado!', 'El desarrollador ha sido activado exitosamente.', 'success');

                // Volver a obtener los datos con refetch
                refetch();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo activar el desarrollador.', 'error');
            }
        }
    };


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Desarrolladores</h1>
            <p className="mb-6 text-center text-gray-700">Listado de Desarrolladores Desactivados</p>

            <div className="mb-4 text-center flex justify-center gap-4">
                <Button
                    onClick={() => navigate('/desarrolladores')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                    Volver
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
                        {data
                            .filter((dev: any) => !dev.registroActivo) // Solo desactivados
                            .map((dev: any) => (
                                <tr key={dev.codigoDesarrollador} className="border-t hover:bg-gray-50 transition-all duration-300">
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.rut}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.correoElectronico}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {new Date(dev.fechaContratacion).toLocaleDateString('es-CL')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.aniosExperiencia}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">—</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">Desactivado</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm mx-1 cursor-pointer">
                                            Ver detalles
                                        </button>
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm mx-1 cursor-pointer">
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm mx-1 cursor-pointer"
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm mx-1 cursor-pointer"
                                            onClick={() => activarDesarrollador(dev.codigoDesarrollador)}
                                        >
                                            Activar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>

                </table>
            </div>
     
        </div>
    );
};

export default DesarrolladoresDesactivados;

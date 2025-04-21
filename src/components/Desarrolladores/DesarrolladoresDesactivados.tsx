import '../../index.css';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useDesarrolladoresQuery } from '../../api/useDesarrolladoresQuery';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useProyectosPorDesarrolladorCantidadQuery } from '../../api/useProyectosPorDesarrolladorCantidadQuery';
import ModalVerDetallesDesarrollador from './ModalVerDetallesDesarrollador';
import { useState } from 'react';


interface DesarrolladoresDesactivadosProps {
    token: string;
}

const DesarrolladoresDesactivados: React.FC<DesarrolladoresDesactivadosProps> = ({ token }) => {

    const navigate = useNavigate();
    const { data: desarrolladoresData, isLoading: isLoadingDesarrolladores, error: errorDesarrolladores, refetch } = useDesarrolladoresQuery();
    const { data: proyectosData, error: errorProyectos } = useProyectosPorDesarrolladorCantidadQuery();
    const [isModalVerDetallesOpen, setIsModalVerDetallesOpen] = useState(false);
    const [selectedDesarrollador, setSelectedDesarrollador] = useState<any>(null);
    const [busqueda, setBusqueda] = useState('');

    if (errorDesarrolladores || errorProyectos) {
        return <div>Error: {errorDesarrolladores?.message || errorProyectos?.message}</div>;
    }

    if (isLoadingDesarrolladores) return <div className="text-center mt-10">Cargando...</div>;
    if (errorDesarrolladores) return <div className="text-center mt-10 text-red-500">Error al cargar datos</div>;




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
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        }
                    }
                );

                Swal.fire('¡Activado!', 'El desarrollador ha sido activado exitosamente.', 'success');

                refetch();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo activar el desarrollador.', 'error');
            }
        }
    };

    const mostrarDetalles = (dev: any) => {
        setSelectedDesarrollador(dev);
        setIsModalVerDetallesOpen(true);
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
            <div className="mb-4 text-center">
                <input
                    type="text"
                    placeholder="Buscar desarrollador..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded shadow-sm w-1/2 focus:outline-none focus:ring focus:border-blue-300"
                />
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
                        {desarrolladoresData
                            .filter((dev: any) =>
                                !dev.registroActivo &&
                                (
                                    dev.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    dev.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
                                    dev.correoElectronico.toLowerCase().includes(busqueda.toLowerCase())
                                )
                            )
                            .map((dev: any) => (
                                <tr key={dev.codigoDesarrollador} className="border-t hover:bg-gray-50 transition-all duration-300">
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.rut}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.correoElectronico}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {new Date(dev.fechaContratacion).toLocaleDateString('es-CL')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.aniosExperiencia}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {
                                            proyectosData?.find(
                                                (p: any) => p.codigoDesarrollador === dev.codigoDesarrollador
                                            )?.cantidadProyectos ?? '0'
                                        }
                                    </td>                                    <td className="px-6 py-4 text-sm text-gray-800">Desactivado</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm mx-1 cursor-pointer"
                                            onClick={() => mostrarDetalles(dev)}
                                        >
                                            Ver detalles
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
            <ModalVerDetallesDesarrollador
                isOpen={isModalVerDetallesOpen}
                onClose={() => setIsModalVerDetallesOpen(false)}
                developerData={selectedDesarrollador}
                token={token}
            />
        </div>
    );
};

export default DesarrolladoresDesactivados;

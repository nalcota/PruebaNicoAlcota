import { useEffect, useState } from 'react';
import '../../index.css';
import ModalCrearDesarrollador from './ModalCrearDesarrollador';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useDesarrolladoresQuery } from '../../api/useDesarrolladoresQuery';
import axios from 'axios';
import Swal from 'sweetalert2';
import ModalAsignarProyectos from './ModalAsignarProyectos';
import { useProyectosPorDesarrolladorCantidadQuery } from '../../api/useProyectosPorDesarrolladorCantidadQuery';
import { useProyectosPorDesarrolladorQuery } from '../../api/useProyectosPorDesarrolladorQuery';
import ModalVerDetallesDesarrollador from './ModalVerDetallesDesarrollador';
import { format } from 'date-fns';

interface DesarrolladoresProps {
    token: string;
}
const Desarrolladores: React.FC<DesarrolladoresProps> = ({ token }) => {

    const navigate = useNavigate();
    const { data: desarrolladoresData, isLoading: isLoadingDesarrolladores, error: errorDesarrolladores, refetch } = useDesarrolladoresQuery();
    const { data: proyectosData, isLoading: _isLoadingProyectos, error: errorProyectos } = useProyectosPorDesarrolladorCantidadQuery();
    const { data: proyectosData2, isLoading: _isLoadingProyectos2, error: errorProyectos2 } = useProyectosPorDesarrolladorQuery();
    const [selectedDesarrollador, setSelectedDesarrollador] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [_proyectosAsignados, setProyectosAsignados] = useState<number[]>([]);
    const [isModalVerDetallesOpen, setIsModalVerDetallesOpen] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    const mostrarDetalles = (dev: any) => {
        setSelectedDesarrollador(dev);
        setIsModalVerDetallesOpen(true);
    };

    const handleSave = (proyectosSeleccionados: number[]) => {
        setProyectosAsignados(proyectosSeleccionados);
        refetch();
        setModalAbierto(false);
    };

    if (errorDesarrolladores || errorProyectos || errorProyectos2) {
        return <div>Error: {errorDesarrolladores?.message || errorProyectos?.message || errorProyectos2?.message}</div>;
    }

    useEffect(() => {
        if (proyectosData2) {
            console.log('Proyectos por Desarrollador2:', proyectosData2);
        }
    }, [proyectosData2]);

    useEffect(() => {
        if (proyectosData) {
            console.log('Proyectos por desarrollador:', proyectosData);
        }
    }, [proyectosData]);


    const handleResetDeveloperData = () => {
        setSelectedDesarrollador(null);
    };

    if (isLoadingDesarrolladores) return <div className="text-center mt-10">Cargando...</div>;
    if (errorDesarrolladores) return <div className="text-center mt-10 text-red-500">Error al cargar datos</div>;


    const handleSubmit = (data: any) => {
        console.log("Desarrollador creado:", data);
        refetch();
    };



    const eliminarDesarrollador = async (codigoDesarrollador: string) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción desactivara al desarrollador.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, Desactivar',
            cancelButtonText: 'Cancelar',
        });

        if (resultado.isConfirmed) {
            try {
                await axios.delete(`https://apipruebas.rbu.cl/api/desarrolladores/${codigoDesarrollador}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El desarrollador ha sido eliminado correctamente.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                refetch();

            } catch (error) {
                console.error("Error al desactivar desarrollador:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al desactivar el desarrollador.',
                });
            }
        }
    };

    const handleEdit = (dev: any) => {
        setSelectedDesarrollador(dev);
        setIsModalOpen(true);
    };


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Desarrolladores</h1>
            <p className="mb-6 text-center text-gray-700">Listado de Desarrolladores Activos</p>

            <div className="mb-4 text-center flex justify-center gap-4">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                    Crear Desarrollador
                </Button>

                <Button
                    onClick={() => navigate('/desarrolladores_desactivados')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                    Ver Desarrolladores Desactivados
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
                                dev.registroActivo &&
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
                                        {format(new Date(dev.fechaContratacion), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{dev.aniosExperiencia}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {
                                            proyectosData?.find(
                                                (p: any) => p.codigoDesarrollador === dev.codigoDesarrollador
                                            )?.cantidadProyectos ?? '0'
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        Activo
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm mx-1 cursor-pointer"
                                            onClick={() => mostrarDetalles(dev)}
                                        >
                                            Ver detalles
                                        </button>
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm mx-1 cursor-pointer"
                                            onClick={() => handleEdit(dev)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm mx-1 cursor-pointer"
                                            onClick={() => eliminarDesarrollador(dev.codigoDesarrollador)}
                                        >
                                            Desactivar
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedDesarrollador(dev);
                                                const proyectosDev = proyectosData2?.filter(
                                                    (p: any) => p.codigoDesarrollador === dev.codigoDesarrollador
                                                ).map((p: any) => p.codigoProyecto) || [];
                                                setProyectosAsignados(proyectosDev);
                                                setModalAbierto(true);
                                            }}
                                            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm mx-1 cursor-pointer"
                                        >
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
                onSubmit={handleSubmit}
                developerData={selectedDesarrollador}
                onResetDeveloperData={handleResetDeveloperData}
                token={token}

            />
            <ModalAsignarProyectos
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleSave}
                developerData={selectedDesarrollador}
                token={token}
            />

            <ModalVerDetallesDesarrollador
                isOpen={isModalVerDetallesOpen}
                onClose={() => setIsModalVerDetallesOpen(false)}
                developerData={selectedDesarrollador}
                token={token}

            />
        </div>
    );
};

export default Desarrolladores;

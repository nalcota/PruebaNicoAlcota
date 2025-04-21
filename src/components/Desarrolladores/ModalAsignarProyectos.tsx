import _React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useProyectosQuery } from '../../api/useProyectosQuery';
import { useProyectosPorDesarrolladorQuery } from '../../api/useProyectosPorDesarrolladorQuery';

interface Proyecto {
    codigoProyecto: number;
    nombre: string;
    registroActivo: boolean;
    codigoDesarrollador: number;
}

interface DeveloperData {
    id: number;
    codigoDesarrollador: number;
}

interface ModalAsignarProyectosProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (proyectosSeleccionados: number[]) => void;
    developerData: DeveloperData;
    token: string; 
}

const ModalAsignarProyectos = ({ isOpen, onClose, onSave, developerData, token }: ModalAsignarProyectosProps) => {
    const { data: proyectos, isLoading, isError } = useProyectosQuery();
    const { data: proyectosData2, isLoading: isLoadingProyectos2, error: errorProyectos2 } = useProyectosPorDesarrolladorQuery();

    const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (isOpen && proyectosData2 && developerData?.codigoDesarrollador) {
            const proyectosAsociados = proyectosData2
                .find((item) => item.codigoDesarrollador === developerData.codigoDesarrollador)?.proyectos || [];

            const proyectosSeleccionados = proyectosAsociados.map((proyecto: Proyecto) => proyecto.codigoProyecto);
            setSeleccionados(new Set(proyectosSeleccionados));
        }
    }, [isOpen, proyectosData2, developerData]);

    // SE USARAN 2 FUNCIONES UNA PARA ASIGNAR UNA PARA DESASIGNAR
    const asignarProyectoADesarrollador = async (codigoProyecto: number, codigoDesarrollador: number) => {
        try {
            await axios.post(
                `https://apipruebas.rbu.cl/api/proyectos/${codigoProyecto}/desarrolladores/${codigoDesarrollador}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(`Proyecto ${codigoProyecto} asignado al desarrollador ${codigoDesarrollador}`);
        } catch (error) {
            console.error('Error al asignar proyecto:', error);
        }
    };

    const desasignarProyectoADesarrollador = async (codigoProyecto: number, codigoDesarrollador: number) => {
        const token = 'T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9';
        try {
            await axios.delete(
                `https://apipruebas.rbu.cl/api/proyectos/${codigoProyecto}/desarrolladores/${codigoDesarrollador}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(` Proyecto ${codigoProyecto} desasignado del desarrollador ${codigoDesarrollador}`);
        } catch (error) {
            console.error(' Error al desasignar proyecto:', error);
        }
    };
    const toggleCheckbox = (codigo: number) => {
        setSeleccionados(prev => {
            const newSeleccionados = new Set(prev);
            const isSelected = newSeleccionados.has(codigo);

            if (isSelected) {
                newSeleccionados.delete(codigo);
                desasignarProyectoADesarrollador(codigo, developerData.codigoDesarrollador);
            } else {
                newSeleccionados.add(codigo);
                asignarProyectoADesarrollador(codigo, developerData.codigoDesarrollador);
            }

            return newSeleccionados;
        });
    };

    const handleGuardar = () => {
        onSave(Array.from(seleccionados)); 
        onClose();
        window.location.reload();
    };
    const handleCancelarConRecarga = () => {
        onClose();
        window.location.reload();
    };
    if (errorProyectos2) {
        return <div>Error: {errorProyectos2?.message}</div>;
    }
    if (!isOpen) return null;
    if (isLoading || isLoadingProyectos2) return <p className="text-center">Cargando proyectos...</p>;
    if (isError) return <p className="text-center">Error al cargar los proyectos.</p>;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Asignar Proyectos</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto px-2">
                    {proyectos
                        ?.filter((proyecto: Proyecto) => proyecto.registroActivo)
                        .map((proyecto: Proyecto) => (
                            <label
                                key={proyecto.codigoProyecto}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={seleccionados.has(proyecto.codigoProyecto)} 
                                    onChange={() => toggleCheckbox(proyecto.codigoProyecto)}
                                    className="w-5 h-5 text-green-600 accent-green-500 rounded focus:ring-green-500"
                                />
                                <span className="text-gray-700">{proyecto.nombre}</span>
                            </label>
                        ))}
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={handleCancelarConRecarga}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAsignarProyectos;

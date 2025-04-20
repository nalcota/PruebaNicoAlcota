import React, { useState } from 'react';
import { useProyectosQuery } from '../api/useProyectosQuery';

const ModalAsignarProyectos = ({ isOpen, onClose, onSave }: any) => {
    const { data: proyectos, isLoading, isError } = useProyectosQuery();
    console.log('Proyectos:', proyectos);

    const [seleccionados, setSeleccionados] = useState<number[]>([]);

    const toggleCheckbox = (codigo: number) => {
        if (seleccionados.includes(codigo)) {
            setSeleccionados(seleccionados.filter(c => c !== codigo));
        } else {
            setSeleccionados([...seleccionados, codigo]);
        }
    };

    const handleGuardar = () => {
        onSave(seleccionados);
        onClose();
    };

    if (!isOpen) return null;
    if (isLoading) return <p className="text-center">Cargando proyectos...</p>;
    if (isError) return <p className="text-center">Error al cargar los proyectos.</p>;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Asignar Proyectos</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto px-2">
                    {proyectos
                        ?.filter((proyecto: any) => proyecto.registroActivo)
                        .map((proyecto: any) => (
                            <label
                                key={proyecto.codigoProyecto}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={seleccionados.includes(proyecto.codigoProyecto)}
                                    onChange={() => toggleCheckbox(proyecto.codigoProyecto)}
                                    className="w-5 h-5 text-green-600 accent-green-500 rounded focus:ring-green-500"
                                />
                                <span className="text-gray-700">{proyecto.nombre}</span>
                            </label>
                        ))}
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
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

import _React, { useEffect, useState } from 'react';
import { useDesarrolladoresPorProyectosQuery } from '../../api/UseDesarrolladoresPorProyectosQuery';
import axios from 'axios';

const ModalAsignarDesarrolladores = ({ isOpen, onClose, desarrolladores, handleGuardar, proyectoSeleccionado }: any) => {
    if (!isOpen) return null;

    const [seleccionadosEstado, setSeleccionadosEstado] = useState<Set<number>>(new Set());

    const { data: desarrolladoresDataPorProyectos, error: errorDesarrolladoresPorProyectos } = useDesarrolladoresPorProyectosQuery();

    console.log('desarrolladores:', desarrolladores);
    console.log('desarrolladoresDataPorProyectos', desarrolladoresDataPorProyectos);
    console.log('proyectoSeleccionado', proyectoSeleccionado);

    if (errorDesarrolladoresPorProyectos) return <div className="text-center mt-10 text-red-500">Error al cargar datos</div>;

    useEffect(() => {
        if (isOpen && desarrolladoresDataPorProyectos && proyectoSeleccionado) {
            const proyecto = desarrolladoresDataPorProyectos.find((proj: any) => proj.codigoProyecto === proyectoSeleccionado);

            if (proyecto && proyecto.desarrolladores) {
                const desarrolladoresSeleccionados = proyecto.desarrolladores.map((dev: any) => dev.codigoDesarrollador);
                setSeleccionadosEstado(new Set(desarrolladoresSeleccionados));
            }
        }
    }, [isOpen, desarrolladoresDataPorProyectos, proyectoSeleccionado]);

    //se usara una funcion para optimizar codigo
    const asignarDesarrollador = async (codigoDesarrollador: number, agregar: boolean) => {
        try {
            const url = `https://apipruebas.rbu.cl/api/proyectos/${proyectoSeleccionado}/desarrolladores/${codigoDesarrollador}`;
            const metodo = agregar ? 'POST' : 'DELETE';
            const headers = {
                'Authorization': `Bearer T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9`
            };

            await axios({
                method: metodo,
                url: url,
                headers: headers,
                data: {},
            });

            console.log(`Desarrollador ${agregar ? 'agregado' : 'eliminado'} exitosamente`);
        } catch (error) {
            console.error('Error al asignar desarrollador:', error);
        }
    };

    const toggleSeleccionado = (codigoDesarrollador: number) => {
        const nuevoSeleccionados = new Set(seleccionadosEstado);
        const estaSeleccionado = nuevoSeleccionados.has(codigoDesarrollador);

        if (estaSeleccionado) {
            nuevoSeleccionados.delete(codigoDesarrollador);
            asignarDesarrollador(codigoDesarrollador, false);
        } else {
            nuevoSeleccionados.add(codigoDesarrollador);
            asignarDesarrollador(codigoDesarrollador, true);
        }

        setSeleccionadosEstado(nuevoSeleccionados);
    };

    const handleGuardarConRecarga = () => {
        handleGuardar();
        window.location.reload();
    };
    const handleCancelarConRecarga = () => {
        onClose();
        window.location.reload();
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Asignar Desarrolladores</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto px-2">
                    {desarrolladores
                        ?.filter((dev: any) => dev.registroActivo) 
                        .map((dev: any) => {
                            console.log('Rendering dev:', dev.codigoDesarrollador);
                            return (
                                <label
                                    key={dev.id}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <input
                                        type="checkbox"
                                        checked={seleccionadosEstado.has(dev.codigoDesarrollador)}
                                        onChange={() => toggleSeleccionado(dev.codigoDesarrollador)}
                                        className="w-5 h-5 text-green-600 accent-green-500 rounded focus:ring-green-500"
                                    />
                                    <span className="text-gray-700">{dev.nombre}</span>
                                </label>
                            );
                        })}
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button onClick={handleCancelarConRecarga} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                        Cancelar
                    </button>
                    <button onClick={handleGuardarConRecarga} className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAsignarDesarrolladores;

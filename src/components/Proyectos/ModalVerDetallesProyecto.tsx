import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalVerDetallesProyectoProps {
    isOpen: boolean;
    onClose: () => void;
    proyectoData: any; 
    token: string;
}

const ModalVerDetallesProyecto: React.FC<ModalVerDetallesProyectoProps> = ({ isOpen, onClose, proyectoData, token}) => {
    const [desarrolladores, setDesarrolladores] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        const obtenerDesarrolladores = async () => {
            if (proyectoData?.codigoProyecto) {
                setLoading(true);
                try {
                    const response = await axios.get(`https://apipruebas.rbu.cl/api/proyectos/${proyectoData.codigoProyecto}/desarrolladores`, {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        }
                    });
                    setDesarrolladores(response.data);
                    setError('');
                } catch (err) {
                    setError('Error al obtener los desarrolladores');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (proyectoData?.codigoProyecto) {
            obtenerDesarrolladores();
        }
    }, [proyectoData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="modal-content bg-white p-8 rounded-lg shadow-2xl transform transition-all scale-95 hover:scale-100">
                <button
                    onClick={onClose}
                    className="text-red-600 font-bold text-2xl absolute top-4 right-4 hover:text-red-800 focus:outline-none"
                >
                    X
                </button>

                {proyectoData ? (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-800">Detalles del Proyecto</h3>
                        <div className="text-gray-600">
                            <p><strong>Nombre del Proyecto:</strong> {proyectoData.nombre}</p>
                            <p><strong>Fecha de Inicio:</strong> {new Date(proyectoData.fechaInicio).toLocaleDateString('es-CL')}</p>
                            <p><strong>Fecha de Término:</strong> {new Date(proyectoData.fechaTermino).toLocaleDateString('es-CL')}</p>
                            <p><strong>Estado:</strong> {proyectoData.registroActivo ? 'Activo' : 'Inactivo'}</p>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-xl font-semibold text-gray-700">Desarrolladores:</h4>
                            {loading ? (
                                <p className="text-gray-600">Cargando desarrolladores...</p>
                            ) : error ? (
                                <p className="text-red-600">{error}</p>
                            ) : desarrolladores.length === 0 ? (
                                <p className="text-gray-600">No hay desarrolladores asignados al proyecto.</p>
                            ) : (
                                <ul className="list-disc pl-6">
                                    {desarrolladores.map((desarrollador) => (
                                        <li key={desarrollador.codigoDesarrollador} className="text-gray-600">
                                            {desarrollador.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No se encontraron detalles del proyecto.</p>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalVerDetallesProyecto;

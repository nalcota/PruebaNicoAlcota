import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalVerDetallesDesarrolladorProps {
    isOpen: boolean;
    onClose: () => void;
    developerData: any;
    token: string;
}

const ModalVerDetallesDesarrollador: React.FC<ModalVerDetallesDesarrolladorProps> = ({ isOpen, onClose, developerData, token }) => {
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const obtenerProyectos = async () => {
            if (developerData?.codigoDesarrollador) {
                setLoading(true);
                try {
                    const response = await axios.get(`https://apipruebas.rbu.cl/api/desarrolladores/${developerData.codigoDesarrollador}/proyectos`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    setProyectos(response.data);
                    setError('');
                } catch (err) {
                    setError('Error al obtener los proyectos');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (developerData?.codigoDesarrollador) {
            obtenerProyectos();
        }
    }, [developerData]);

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

                {developerData ? (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-800">Detalles del Desarrollador</h3>
                        <div className="text-gray-600">
                            <p><strong>Nombre Completo:</strong> {developerData.nombre}</p>
                            <p><strong>RUT:</strong> {developerData.rut}</p>
                            <p><strong>Correo Electrónico:</strong> {developerData.correoElectronico}</p>
                            <p><strong>Fecha de Contratación:</strong> {new Date(developerData.fechaContratacion).toLocaleDateString('es-CL')}</p>
                            <p><strong>Años de Experiencia:</strong> {developerData.aniosExperiencia}</p>
                        </div>

                        {/* Lista de proyectos */}
                        <div className="mt-4">
                            <h4 className="text-xl font-semibold text-gray-700">Proyectos Asignados:</h4>
                            {loading ? (
                                <p className="text-gray-600">Cargando proyectos...</p>
                            ) : error ? (
                                <p className="text-red-600">{error}</p>
                            ) : proyectos.length === 0 ? (
                                <p className="text-gray-600">No hay proyectos asignados al desarrollador.</p>
                            ) : (
                                <ul className="list-disc pl-6">
                                    {proyectos.map((proyecto) => (
                                        <li key={proyecto.codigoProyecto} className="text-gray-600">
                                            {proyecto.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No se encontraron detalles del desarrollador.</p>
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

export default ModalVerDetallesDesarrollador;

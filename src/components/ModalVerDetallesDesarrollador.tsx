import React from 'react';

interface ModalVerDetallesDesarrolladorProps {
    isOpen: boolean;
    onClose: () => void;
    developerData: any;  // Aquí puedes usar una interfaz más específica para el desarrollador si la tienes
}

const ModalVerDetallesDesarrollador: React.FC<ModalVerDetallesDesarrolladorProps> = ({ isOpen, onClose, developerData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="modal-content bg-white p-8 rounded-lg shadow-2xl transform transition-all scale-95 hover:scale-100">
                <button onClick={onClose} className="text-red-600 font-bold text-2xl absolute top-4 right-4 hover:text-red-800 focus:outline-none">
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
                    </div>
                ) : (
                    <p className="text-gray-600">No se encontraron detalles del desarrollador.</p>
                )}
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalVerDetallesDesarrollador;

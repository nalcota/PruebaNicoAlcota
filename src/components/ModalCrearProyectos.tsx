import React from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
  };

  const ModalCrearProyecto = ({ isOpen, onClose }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[600px] rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Crear Desarrollador</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                        <input type="text" className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">RUT</label>
                        <input type="text" className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input type="email" className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de contratación</label>
                        <input type="date" className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Años de experiencia</label>
                        <input type="number" className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Proyectos asignados</label>
                        <input type="number" className="w-full border rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select className="w-full border rounded px-3 py-2 mt-1">
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCrearProyecto;

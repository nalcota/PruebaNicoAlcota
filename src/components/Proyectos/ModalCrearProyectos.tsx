import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

type Proyecto = {
    codigoProyecto: number;
    nombre: string;
    fechaInicio: string;
    fechaTermino: string;
};
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    proyectoInicial?: Proyecto | null;
    token: string;
    onResetProyectoData: () => void;

};

const ModalCrearProyecto = ({ isOpen, onClose, onSubmit, proyectoInicial, token, onResetProyectoData }: ModalProps) => {

    const [nombre, setNombre] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaTermino, setFechaTermino] = useState('');
    const [_error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (proyectoInicial) {
            setNombre(proyectoInicial.nombre);
            setFechaInicio(proyectoInicial.fechaInicio.split('T')[0]);
            setFechaTermino(proyectoInicial.fechaTermino.split('T')[0]);
        } else {
            resetForm();
        }
    }, [proyectoInicial, isOpen]);
    const resetForm = () => {
        setNombre('');
        setFechaInicio('');
        setFechaTermino('');
        setFormErrors({
            nombre: '',
            fechaInicio: '',
            fechaTermino: '',
        });
    };



    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({
        nombre: '',
        fechaInicio: '',
        fechaTermino: '',
    });

    if (!isOpen) return null;

    const validateForm = (): boolean => {
        let errors = { ...formErrors };

        if (!nombre) errors.nombre = 'El nombre del proyecto es obligatorio';
        else errors.nombre = '';

        if (!fechaInicio) errors.fechaInicio = 'La fecha de inicio es obligatoria';
        else errors.fechaInicio = '';

        if (!fechaTermino) errors.fechaTermino = 'La fecha de término es obligatoria';
        else errors.fechaTermino = '';

        // validar que la fecha de termino no sea anterior a la de inicio
        if (fechaTermino && fechaInicio && new Date(fechaTermino) < new Date(fechaInicio)) {
            errors.fechaTermino = 'La fecha de término no puede ser anterior a la fecha de inicio';
        } else if (!errors.fechaTermino) {
            errors.fechaTermino = '';
        }

        setFormErrors(errors);

        return Object.values(errors).every((error) => error === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire('Error', 'Por favor, completa correctamente todos los campos.', 'error');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const proyectoData = {
                nombre,
                fechaInicio: `${fechaInicio}T00:00:00`,
                fechaTermino: `${fechaTermino}T00:00:00`,
            };

            let response;

            if (proyectoInicial && proyectoInicial.codigoProyecto) {
                // editar proyecto
                response = await axios.put(
                    `https://apipruebas.rbu.cl/api/proyectos/${proyectoInicial.codigoProyecto}`,
                    proyectoData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                Swal.fire('Éxito', 'Proyecto actualizado correctamente.', 'success');
            } else {    
                // crear proyecto
                response = await axios.post(
                    'https://apipruebas.rbu.cl/api/proyectos',
                    proyectoData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                Swal.fire('Éxito', 'Proyecto creado exitosamente.', 'success');
            }
            onResetProyectoData();

            onSubmit(response.data);
            onClose();
        } catch (error) {
            console.error('Error al guardar el proyecto', error);
            Swal.fire('Error', 'Hubo un error al guardar el proyecto.', 'error');
        } finally {
            setLoading(false);
        }
    };
 
    const handleCancel = () => {
        resetForm(); 
        onResetProyectoData();
        onClose();
    };
    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[600px] rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
                    {proyectoInicial ? 'Editar Proyecto' : 'Crear Proyecto'}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Proyecto</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        {formErrors.nombre && <div className="text-red-500 mb-2">{formErrors.nombre}</div>}

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                        {formErrors.fechaInicio && <div className="text-red-500 mb-2">{formErrors.fechaInicio}</div>}

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Termino</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={fechaTermino}
                            onChange={(e) => setFechaTermino(e.target.value)}
                        />
                        {formErrors.fechaTermino && <div className="text-red-500 mb-2">{formErrors.fechaTermino}</div>}

                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCrearProyecto;

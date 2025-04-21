import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    developerData: any;
    onResetDeveloperData: () => void;
    token: string;
};


const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; 
};

const ModalCrearDesarrollador = ({ isOpen, onClose, onSubmit, developerData, onResetDeveloperData, token }: ModalProps) => {
    if (!isOpen) return null;

    const initialFormData = {
        nombre: '',
        rut: '',
        correoElectronico: '',
        fechaContratacion: '',
        aniosExperiencia: 0,
    };
    const [formData, setFormData] = useState({
        nombre: developerData?.nombre || '',
        rut: developerData?.rut || '',
        correoElectronico: developerData?.correoElectronico || '',
        fechaContratacion: developerData?.fechaContratacion || '',
        aniosExperiencia: developerData?.aniosExperiencia || 0,
    });
    const [formErrors, setFormErrors] = useState({
        nombre: '',
        rut: '',
        correoElectronico: '',
        fechaContratacion: '',
        aniosExperiencia: '',
    });

    useEffect(() => {
        if (developerData) {
            setFormData({
                nombre: developerData.nombre,
                rut: developerData.rut,
                correoElectronico: developerData.correoElectronico,
                fechaContratacion: formatDate(developerData.fechaContratacion),
                aniosExperiencia: developerData.aniosExperiencia,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [developerData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'aniosExperiencia' ? Number(value) : value
        }));
    };

    const handleCancel = () => {
        onResetDeveloperData();
        onClose(); 
    };

    //funcion para ingresar solo numeros
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setFormData(prevState => ({
                ...prevState,
                aniosExperiencia: Number(value) 
            }));
            setFormErrors(prevState => ({
                ...prevState,
                aniosExperiencia: ''
            }));
        } else {
            setFormErrors(prevState => ({
                ...prevState,
                aniosExperiencia: 'Por favor, ingrese un número válido.'
            }));
        }
    };



    const validateForm = (): boolean => {
        let errors = { ...formErrors };

        if (!formData.nombre) errors.nombre = 'Este campo es obligatorio';
        else errors.nombre = '';

        if (!formData.rut) errors.rut = 'Este campo es obligatorio';
        else errors.rut = '';

        if (!formData.correoElectronico) errors.correoElectronico = 'Este campo es obligatorio';
        else errors.correoElectronico = '';

        if (!formData.fechaContratacion) errors.fechaContratacion = 'Este campo es obligatorio';
        else errors.fechaContratacion = '';

        if (formData.aniosExperiencia <= 0) errors.aniosExperiencia = 'Los años de experiencia no puede ser 0';
        else errors.aniosExperiencia = '';

        setFormErrors(errors);

        return Object.values(errors).every(error => error === '');
    };
    const fechaFormateada = formData.fechaContratacion
        ? new Date(formData.fechaContratacion).toISOString().split('T')[0]
        : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const url = developerData
            ? `https://apipruebas.rbu.cl/api/desarrolladores/${developerData.codigoDesarrollador}`
            : 'https://apipruebas.rbu.cl/api/desarrolladores';

        const fechaISO = new Date(formData.fechaContratacion).toISOString().split('.')[0];

        const dataToSend = {
            ...formData,
            fechaContratacion: fechaISO
        };

        try {
            const response = developerData
                ? await axios.put(url, dataToSend, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                : await axios.post(url, dataToSend, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

            Swal.fire({
                title: '¡Éxito!',
                text: developerData ? 'Desarrollador actualizado correctamente.' : 'Desarrollador creado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            onSubmit(response.data);
            onClose();
            onResetDeveloperData();
        } catch (error) {
            console.error('Error al guardar el desarrollador:', error);
            Swal.fire({
                title: '¡Error!',
                text: 'Hubo un error al guardar el desarrollador.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };


    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[600px] rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
                    {developerData ? 'Actualizar Desarrollador' : 'Crear Desarrollador'}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {formErrors.nombre && <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">RUT</label>
                        <input
                            type="text"
                            name="rut"
                            value={formData.rut}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                            maxLength={10} 
                        />
                        {formErrors.rut && <p className="text-red-500 text-sm mt-1">{formErrors.rut}</p>}
                        <p className="text-sm text-gray-500 mt-1">El formato de RUT es 99999999-9</p> 
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                            type="email"
                            name="correoElectronico"
                            value={formData.correoElectronico}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {formErrors.correoElectronico && <p className="text-red-500 text-sm mt-1">{formErrors.correoElectronico}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de contratación</label>
                        <input
                            type="date"
                            name="fechaContratacion"
                            value={fechaFormateada}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />



                        {formErrors.fechaContratacion && <p className="text-red-500 text-sm mt-1">{formErrors.fechaContratacion}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Años de experiencia</label>
                        <input
                            type="number"
                            name="aniosExperiencia"
                            value={formData.aniosExperiencia}
                            onChange={handleNumberChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {formErrors.aniosExperiencia && <p className="text-red-500 text-sm mt-1">{formErrors.aniosExperiencia}</p>}
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
                        >
                            {developerData ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCrearDesarrollador;
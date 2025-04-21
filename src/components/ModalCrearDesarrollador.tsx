import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AnyARecord } from 'dns';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    developerData: any;
    onResetDeveloperData: () => void;

};


const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // "2025-04-12"
};

const ModalCrearDesarrollador = ({ isOpen, onClose, onSubmit, developerData, onResetDeveloperData }: ModalProps) => {
    if (!isOpen) return null;

    const initialFormData = {
        nombre: '',
        rut: '',
        correoElectronico: '',
        fechaContratacion: '',
        aniosExperiencia: 0,
        estado: 'Activo'
    };
    const [formData, setFormData] = useState({
        nombre: developerData?.nombre || '',
        rut: developerData?.rut || '',
        correoElectronico: developerData?.correoElectronico || '',
        fechaContratacion: developerData?.fechaContratacion || '',
        aniosExperiencia: developerData?.aniosExperiencia || 0,
        estado: developerData?.estado || 'Activo'
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
            // Si hay datos de un desarrollador, actualiza el formulario
            setFormData({
                nombre: developerData.nombre,
                rut: developerData.rut,
                correoElectronico: developerData.correoElectronico,
                fechaContratacion: formatDate(developerData.fechaContratacion),
                aniosExperiencia: developerData.aniosExperiencia,
                estado: developerData.estado
            });
        } else {
            setFormData(initialFormData);
        }
    }, [developerData]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleCancel = () => {
        onResetDeveloperData();
        onClose(); // Cerrar el modal
    };

    //funcion para ingresar solo numeros
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setFormData(prevState => ({
                ...prevState,
                aniosExperiencia: value
            }));
            setFormErrors(prevState => ({
                ...prevState,
                aniosExperiencia: ''
            }));
        } else {
            // Si el valor no es un número, puedes mostrar un mensaje de error
            setFormErrors(prevState => ({
                ...prevState,
                aniosExperiencia: 'Por favor, ingrese un número válido.'
            }));
        }
    };


    const validateForm = (): boolean => {
        let errors = { ...formErrors };

        // Validar campos obligatorios
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

        // Si hay errores, retornar false
        return Object.values(errors).every(error => error === '');
    };
    const fechaFormateada = formData.fechaContratacion
        ? new Date(formData.fechaContratacion).toISOString().split('T')[0]
        : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const token = 'T7fZ9gHj5KmN2pQr8sV3uW6xY1zA4bC0dE7fG9hJ2kL4mN6pQ8rS0tV3wX5yZ7aC9'; // Bearer Token
        const url = developerData
            ? `https://apipruebas.rbu.cl/api/desarrolladores/${developerData.codigoDesarrollador}`
            : 'https://apipruebas.rbu.cl/api/desarrolladores';

        try {
            const response = developerData
                ? await axios.put(url, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                : await axios.post(url, formData, {
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

            onSubmit(response.data); // Llamar a la función onSubmit para manejar el resultado
            onClose(); // Cerrar el modal después de enviar
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
                        />
                        {formErrors.rut && <p className="text-red-500 text-sm mt-1">{formErrors.rut}</p>}
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
                            type="text"
                            name="aniosExperiencia"
                            value={formData.aniosExperiencia}
                            onChange={handleNumberChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {formErrors.aniosExperiencia && <p className="text-red-500 text-sm mt-1">{formErrors.aniosExperiencia}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
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
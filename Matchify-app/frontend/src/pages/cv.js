import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaPlus, FaTrashAlt, FaPen, FaSave, FaGraduationCap, FaBriefcase, FaCertificate, FaLanguage, FaTools } from 'react-icons/fa';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const CVForm = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [cv, setCV] = useState({
        educacion: [],
        certificacion: [],
        experienciaLaboral: [],
        idioma: [],
        skill: [],
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log('Component mounted, userId:', userId);
        fetchCV();
    }, [userId]);

    const fetchCV = async () => {
        if (!userId) {
            console.error('Error: userId es undefined.');
            return;
        }
        try {
            console.log('Fetching CV data for userId:', userId);
            const response = await axios.get(`http://localhost:3001/cv/${userId}`);
            console.log('CV data received:', response.data);

            if (response.data.success) {
                const cvData = response.data.data;
                setCV({
                    educacion: cvData.educacion || [],
                    certificacion: cvData.certificacion || [],
                    experienciaLaboral: cvData.experienciaLaboral || [],
                    idioma: cvData.idioma || [],
                    skill: cvData.skill || [],
                });

                const hasData = Object.values(cvData).some(section =>
                    Array.isArray(section) && section.length > 0
                );
                setIsEditing(hasData);
            }
        } catch (error) {
            console.error('Error al obtener el CV:', error);
            Swal.fire('Error', 'No se pudo cargar el CV', 'error');
        }
    };

    const handleInputChange = (section, index, field, value) => {
        setCV(prevCV => ({
            ...prevCV,
            [section]: prevCV[section].map((item, i) =>
                i === index ? {...item, [field]: value} : item
            ),
        }));
    };

    const handleSectionAdd = (section) => {
        setCV(prevCV => ({
            ...prevCV,
            [section]: [...prevCV[section], {name: '', description: ''}],
        }));
    };

    const handleSectionDelete = async (section, id, index) => {
        console.log('handleSectionDelete called with:', { section, id, index });
        console.log('Current CV state:', cv);
        console.log('Item to delete:', cv[section][index]);

        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            console.log('SweetAlert result:', result);

            if (!result.isConfirmed) {
                console.log('Delete cancelled by user');
                return;
            }

            if (id) {
                console.log('Attempting DELETE request to:', `http://localhost:3001/cv/${userId}/${section}/${id}`);
                try {
                    const deleteResponse = await axios.delete(
                        `http://localhost:3001/cv/${userId}/${section}/${id}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                // Añade aquí cualquier header necesario para tu API
                            }
                        }
                    );
                    console.log('Delete response:', deleteResponse);

                    if (!deleteResponse.data.success) {
                        throw new Error(deleteResponse.data.message || 'Error al eliminar el elemento');
                    }
                } catch (error) {
                    console.error('Error in DELETE request:', error);
                    throw error;
                }
            } else {
                console.log('No ID provided, skipping DELETE request');
            }

            // Actualizar estado local
            setCV(prevCV => {
                console.log('Updating CV state. Previous state:', prevCV);
                const updatedSection = [...prevCV[section]];
                updatedSection.splice(index, 1);
                const newState = {
                    ...prevCV,
                    [section]: updatedSection
                };
                console.log('New CV state:', newState);
                return newState;
            });

            await Swal.fire({
                title: 'Eliminado',
                text: 'El elemento ha sido eliminado correctamente',
                icon: 'success',
                timer: 1500
            });

            // Recargar datos
            console.log('Reloading CV data...');
            await fetchCV();

        } catch (error) {
            console.error('Error in handleSectionDelete:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el elemento', 'error');
        }
    };

    const validateAndCleanData = (data) => {
        const cleanData = {};

        Object.entries(data).forEach(([key, value]) => {
            // Filtrar elementos vacíos o incompletos
            cleanData[key] = value.filter(item => {
                if (!item) return false;

                switch (key) {
                    case 'educacion':
                        return item.institucion && item.gradoObtenido;
                    case 'certificacion':
                        return item.nombre && item.organizacionEmisora;
                    case 'experienciaLaboral':
                        return item.tituloPuesto && item.empresa;
                    case 'idioma':
                        return item.nombre && item.nivelDominio;
                    case 'skill':
                        return item.nombre && item.nivelDominio;
                    default:
                        return false;
                }
            });
        });

        return cleanData;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userId) {
            Swal.fire('Error', 'No hay userId proporcionado.', 'error');
            return;
        }

        try {
            // Limpiar y validar datos antes de enviar
            const cleanedData = validateAndCleanData(cv);
            console.log('Datos limpiados antes de enviar:', cleanedData);

            const existingSections = {
                educacion: cv.educacion.filter(item => item._id),  // Cambié `id` por `_id`
                certificacion: cv.certificacion.filter(item => item._id),
                experienciaLaboral: cv.experienciaLaboral.filter(item => item._id),
                idioma: cv.idioma.filter(item => item._id),
                skill: cv.skill.filter(item => item._id)
            };

            const newSections = {
                educacion: cv.educacion.filter(item => !item._id),
                certificacion: cv.certificacion.filter(item => !item._id),
                experienciaLaboral: cv.experienciaLaboral.filter(item => !item._id),
                idioma: cv.idioma.filter(item => !item._id),
                skill: cv.skill.filter(item => !item._id)
            };

            let response;

            // Realiza un PUT para las secciones existentes
            if (Object.values(existingSections).some(section => section.length > 0)) {
                console.log('Actualizando secciones existentes con PUT:', existingSections);
                response = await axios.put(`http://localhost:3001/cv/${userId}`, existingSections);
                if (!response.data.success) {
                    throw new Error(response.data.message);
                }
            }

            // Realiza un POST para las nuevas secciones
            const newSectionsValues = Object.values(newSections).some(section => section.length > 0);
            if (newSectionsValues) {
                console.log('Creando nuevas secciones con POST:', newSections);
                response = await axios.post(`http://localhost:3001/cv/${userId}`, newSections);
                if (!response.data.success) {
                    throw new Error(response.data.message);
                }
            }

            Swal.fire({
                title: 'Éxito',
                text: `CV ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            navigate(-1);
        } catch (error) {
            console.error('Error al guardar el CV:', error);
            Swal.fire('Error', error.message || 'Hubo un problema al guardar el CV', 'error');
        }
    };


    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-8xl mx-auto p-8 rounded-lg shadow-lg space-y-8">
            <div className="flex items-center mb-6">
                <ArrowLeftIcon
                    className="h-6 w-6 text-gray-700 cursor-pointer hover:text-primary transition"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-2xl font-semibold text-gray-800 ml-4 py-2">Regresar</h2>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {isEditing ? 'Editar CV' : 'Crear CV'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-12">

                {/* Sección de Educación */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600 flex items-center">
                        <FaGraduationCap className="mr-2"/> Educación {/* Aquí se agrega el ícono */}
                    </h2>

                    {cv.educacion.map((edu, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Institución"
                                value={edu.institucion}
                                onChange={(e) => handleInputChange('educacion', index, 'institucion', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Grado Obtenido"
                                value={edu.gradoObtenido}
                                onChange={(e) => handleInputChange('educacion', index, 'gradoObtenido', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-blue-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    value={edu.fechaInicio}
                                    onChange={(e) => handleInputChange('educacion', index, 'fechaInicio', e.target.value)}
                                    className="border-b p-2 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="date"
                                    value={edu.fechaFin}
                                    onChange={(e) => handleInputChange('educacion', index, 'fechaFin', e.target.value)}
                                    className="border-b p-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('Delete button clicked for:', {edu, index});
                                    handleSectionDelete('educacion', edu._id, index);
                                }}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4"
                            >
                                <FaTrashAlt className="inline-block mr-2"/>
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('educacion')}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out shadow-md">
                        <FaPlus className="mr-2"/> Agregar Educación
                    </button>
                </div>

                {/* Sección de certificación */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
                    <h2 className="text-2xl font-semibold mb-4 text-green-600 flex items-center">
                        <FaCertificate className="mr-2"/> Certificación
                    </h2>
                    {cv.certificacion.map((cert, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Nombre de la Certificación"
                                value={cert.nombre}
                                onChange={(e) => handleInputChange('certificacion', index, 'nombre', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-green-500"
                            />
                            <input
                                type="text"
                                placeholder="Institución"
                                value={cert.organizacionEmisora}
                                onChange={(e) => handleInputChange('certificacion', index, 'organizacionEmisora', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-green-500"
                            />
                            <input
                                type="date"
                                value={cert.fechaObtencion}
                                onChange={(e) => handleInputChange('certificacion', index, 'fechaObtencion', e.target.value)}
                                className="border-b p-2 w-full focus:outline-none focus:border-green-500"
                            />
                            <textarea
                                placeholder="Descripción"
                                value={cert.descripcion}
                                onChange={(e) => handleInputChange('certificacion', index, 'descripcion', e.target.value)}
                                className="border-b p-2 w-full focus:outline-none focus:border-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('certificacion', cert._id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('certificacion')}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out shadow-md">
                        <FaPlus className="mr-2"/> Agregar Certificación
                    </button>
                </div>


                {/* Sección de experienciaLaboral */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-600">
                    <h2 className="text-2xl font-semibold mb-4 text-orange-600 flex items-center">
                        <FaBriefcase className="mr-2"/> experiencia
                    </h2>
                    {cv.experienciaLaboral.map((exp, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Título del Puesto"
                                value={exp.tituloPuesto}
                                onChange={(e) => handleInputChange('experienciaLaboral', index, 'tituloPuesto', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-orange-500"
                            />
                            <input
                                type="text"
                                placeholder="Nombre de la Empresa"
                                value={exp.empresa}
                                onChange={(e) => handleInputChange('experienciaLaboral', index, 'empresa', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-orange-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    value={exp.fechaInicio}
                                    onChange={(e) => handleInputChange('experienciaLaboral', index, 'fechaInicio', e.target.value)}
                                    className="border-b p-2 w-full focus:outline-none focus:border-orange-500"
                                />
                                <input
                                    type="date"
                                    value={exp.fechaFin}
                                    onChange={(e) => handleInputChange('experienciaLaboral', index, 'fechaFin', e.target.value)}
                                    className="border-b p-2 w-full focus:outline-none focus:border-orange-500"
                                />
                            </div>
                            <textarea
                                placeholder="Descripción"
                                value={exp.descripcion}
                                onChange={(e) => handleInputChange('experienciaLaboral', index, 'descripcion', e.target.value)}
                                className="border-b p-2 w-full focus:outline-none focus:border-orange-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('experienciaLaboral', exp._id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('experienciaLaboral')}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out shadow-md">
                        <FaPlus className="mr-2"/> Agregar experiencia
                    </button>
                </div>

                {/* Sección de idioma */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600 flex items-center">
                        <FaLanguage className="mr-2"/> idioma
                    </h2>
                    {cv.idioma.map((idioma, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Nombre del Idioma"
                                value={idioma.nombre}
                                onChange={(e) => handleInputChange('idioma', index, 'nombre', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-purple-500"
                            />
                            <select
                                value={idioma.nivelDominio}
                                onChange={(e) => handleInputChange('idioma', index, 'nivelDominio', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-purple-500 appearance-none"
                            >
                                <option value="">Seleccione un nivel</option>
                                <option value="basico">Básico</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                                <option value="experto">Experto</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('idioma', idioma._id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('idioma')}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out shadow-md">
                        <FaPlus className="mr-2"/> Agregar Idioma
                    </button>
                </div>
                {/* Sección de skill */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-600">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-600 flex items-center">
                        <FaTools className="mr-2"/> Habilidades
                    </h2>
                    {cv.skill.map((skill, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Nombre de la Habilidad"
                                value={skill.nombre}
                                onChange={(e) => handleInputChange('skill', index, 'nombre', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-yellow-500"
                            />
                            <select
                                value={skill.nivelDominio}
                                onChange={(e) => handleInputChange('skill', index, 'nivelDominio', e.target.value)}
                                className="w-full p-2 mb-3 focus:outline-none appearance-none appearance-none"
                            >
                                <option value="">Seleccione un nivel</option>
                                <option value="basico">Básico</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                                <option value="experto">Experto</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('skill', skill._id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('skill')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out shadow-md">
                        <FaPlus className="mr-2"/> Agregar Habilidad
                    </button>
                </div>

                {/* Botón de Crear/Actualizar CV */}
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full flex items-center justify-center transition duration-300 ease-in-out w-full shadow-lg">
                    {isEditing ? <><FaSave className="mr-2"/> Actualizar CV</> : <><FaPen className="mr-2"/> Crear
                        CV</>}
                </button>
            </form>
        </div>
    );
}
    export default CVForm;

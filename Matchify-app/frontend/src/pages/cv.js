import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaPlus, FaTrashAlt, FaPen, FaSave, FaGraduationCap, FaBriefcase, FaCertificate, FaLanguage, FaTools  } from 'react-icons/fa';
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

const CVForm = () => {
    const {userId} = useParams();
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
        const fetchCV = async () => {
            if (!userId) {
                console.error('Error: userId es undefined.');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3001/cv/${userId}`);
                const cvData = response.data.data;

                // Asegúrate de que cada sección esté inicializada como un array vacío
                setCV({
                    educacion: cvData.educacion || [],
                    certificacion: cvData.certificacion || [],
                    experienciaLaboral: cvData.experienciaLaboral || [],
                    idioma: cvData.idioma || [],
                    skill: cvData.skill || [],
                });

                const hasData = Object.values(cvData).some(section => section && section.length > 0);
                setIsEditing(hasData);
            } catch (error) {
                console.error('Error al obtener el CV:', error);
            }
        };
        fetchCV();
    }, [userId]);


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
        setCV(prevCV => {
            const updatedSection = prevCV[section]?.filter((_, idx) => idx !== index) || [];
            const newCV = { ...prevCV, [section]: updatedSection };

            // Si no hay elementos en ninguna sección, cambia isEditing a false
            const hasData = Object.values(newCV).some(sec => sec && sec.length > 0);
            setIsEditing(hasData);

            return newCV;
        });

        if (!id) return; // Solo frontend, sin ID no necesita solicitud al backend

        try {
            await axios.delete(`http://localhost:3001/cv/${userId}/${section}/${id}`);
        } catch (error) {
            console.error('Error al eliminar la sección en la base de datos:', error);
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userId) {
            Swal.fire('Error', 'No hay userId proporcionado.', 'error');
            return;
        }

        try {
            // Filtrar las secciones que ya tienen datos y aquellas que aún están vacías
            const existingSections = {
                educacion: cv.educacion.filter(item => item.id),
                certificacion: cv.certificacion.filter(item => item.id),
                experienciaLaboral: cv.experienciaLaboral.filter(item => item.id),
                idioma: cv.idioma.filter(item => item.id),
                skill: cv.skill.filter(item => item.id)
            };

            const newSections = {
                educacion: cv.educacion.filter(item => !item.id),
                certificacion: cv.certificacion.filter(item => !item.id),
                experienciaLaboral: cv.experienciaLaboral.filter(item => !item.id),
                idioma: cv.idioma.filter(item => !item.id),
                skill: cv.skill.filter(item => !item.id)
            };

            // Realiza un PUT para las secciones existentes y un POST para las nuevas
            if (isEditing) {
                await axios.put(`http://localhost:3001/cv/${userId}`, existingSections);
            }

            // Realiza un POST solo si hay nuevas secciones
            const newSectionsValues = Object.values(newSections).some(section => section.length > 0);
            if (newSectionsValues) {
                await axios.post(`http://localhost:3001/cv/${userId}`, newSections);
            }

            Swal.fire('Éxito', 'CV guardado exitosamente', 'success').then(() => {
                navigate(-1);
            });
        } catch (error) {
            console.error('Error al guardar el CV:', error);
            Swal.fire('Error', 'Hubo un problema al guardar el CV', 'error');
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
                                onClick={() => handleSectionDelete('educacion', edu.id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
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
                                onClick={() => handleSectionDelete('certificacion', cert.id, index)}
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
                                onClick={() => handleSectionDelete('experienciaLaboral', exp.id, index)}
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
                                <option value="básico">Básico</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                                <option value="experto">Experto</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('idioma', idioma.id, index)}
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
                                <option value="básico">Básico</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                                <option value="experto">Experto</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('skill', skill.id, index)}
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

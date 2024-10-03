import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaPlus, FaTrashAlt, FaPen, FaSave, FaGraduationCap, FaBriefcase, FaCertificate, FaLanguage, FaTools  } from 'react-icons/fa';

const CVForm = () => {
    const {userId} = useParams();
    const navigate = useNavigate();
    const [cv, setCV] = useState({
        educacion: [],
        certificaciones: [],
        experienciaLaboral: [],
        idiomas: [],
        skills: [],
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
                const hasData = Object.values(cvData).some(section => section.length > 0);
                setIsEditing(hasData);
                setCV(cvData);
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
        if (!id) {
            setCV(prevCV => ({
                ...prevCV,
                [section]: prevCV[section].filter((_, idx) => idx !== index),
            }));
            return;
        }

        try {
            await axios.delete(`http://localhost:3001/cv/${userId}/${section}/${id}`);
            setCV(prevCV => ({
                ...prevCV,
                [section]: prevCV[section].filter(item => item.id !== id),
            }));
        } catch (error) {
            console.error('Error al eliminar la sección:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userId) {
            Swal.fire('Error', 'No hay userId proporcionado.', 'error');
            return;
        }

        try {
            const filteredCV = {
                ...cv,
                educacion: cv.educacion.filter(item => item.institucion && item.gradoObtenido),
                certificaciones: cv.certificaciones.filter(item => item.nombre),
                experienciaLaboral: cv.experienciaLaboral.filter(item => item.tituloPuesto && item.empresa),
                idiomas: cv.idiomas.filter(item => item.nombre && item.nivelDominio),
                skills: cv.skills.filter(item => item.nombre && item.nivelDominio)
            };

            if (isEditing) {
                await axios.put(`http://localhost:3001/cv/${userId}`, filteredCV);
                Swal.fire('Éxito', 'CV actualizado exitosamente', 'success').then(() => {
                    navigate(-1);
                });
            } else {
                await axios.post(`http://localhost:3001/cv/${userId}`, filteredCV);
                Swal.fire('Éxito', 'CV creado exitosamente', 'success').then(() => {
                    navigate(-1);
                });
            }
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
            <button
                onClick={handleBack}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-300 ease-in-out shadow-md">
                <FaArrowLeft className="mr-2"/> Volver
            </button>

            <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                {isEditing ? 'Editar CV' : 'Crear CV'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-12">

                {/* Sección de Educación */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600 flex items-center">
                        <FaGraduationCap className="mr-2"/> Educación
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

                {/* Sección de Certificaciones */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
                    <h2 className="text-2xl font-semibold mb-4 text-green-600 flex items-center">
                        <FaCertificate className="mr-2"/> Certificaciones
                    </h2>
                    {cv.certificaciones.map((cert, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Nombre de la Certificación"
                                value={cert.nombre}
                                onChange={(e) => handleInputChange('certificaciones', index, 'nombre', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-green-500"
                            />
                            <input
                                type="text"
                                placeholder="Institución"
                                value={cert.institucion}
                                onChange={(e) => handleInputChange('certificaciones', index, 'institucion', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-green-500"
                            />
                            <input
                                type="date"
                                value={cert.fechaObtencion}
                                onChange={(e) => handleInputChange('certificaciones', index, 'fechaObtencion', e.target.value)}
                                className="border-b p-2 w-full focus:outline-none focus:border-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('certificaciones', cert.id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('certificaciones')}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out shadow-md">
                        <FaPlus className="mr-2"/> Agregar Certificación
                    </button>
                </div>

                {/* Sección de Experiencia Laboral */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-600">
                    <h2 className="text-2xl font-semibold mb-4 text-orange-600 flex items-center">
                        <FaBriefcase className="mr-2"/> Experiencia Laboral
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
                        <FaPlus className="mr-2"/> Agregar Experiencia
                    </button>
                </div>

                {/* Sección de Idiomas */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600 flex items-center">
                        <FaLanguage className="mr-2"/> Idiomas
                    </h2>
                    {cv.idiomas.map((idioma, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Nombre del Idioma"
                                value={idioma.nombre}
                                onChange={(e) => handleInputChange('idiomas', index, 'nombre', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="text"
                                placeholder="Nivel de Dominio"
                                value={idioma.nivelDominio}
                                onChange={(e) => handleInputChange('idiomas', index, 'nivelDominio', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-purple-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('idiomas', idioma.id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('idiomas')}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full flex items-center transition duration-300 ease-in-out shadow-md">
                        <FaPlus className="mr-2"/> Agregar Idioma
                    </button>
                </div>

                {/* Sección de Skills */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-600">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-600 flex items-center">
                        <FaTools className="mr-2"/> Habilidades
                    </h2>
                    {cv.skills.map((skill, index) => (
                        <div key={index}
                             className="mb-4 p-4 border border-gray-200 rounded-lg transition duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Nombre de la Habilidad"
                                value={skill.nombre}
                                onChange={(e) => handleInputChange('skills', index, 'nombre', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-yellow-500"
                            />
                            <input
                                type="text"
                                placeholder="Nivel de Dominio"
                                value={skill.nivelDominio}
                                onChange={(e) => handleInputChange('skills', index, 'nivelDominio', e.target.value)}
                                className="border-b w-full p-2 mb-3 focus:outline-none focus:border-yellow-500"
                            />
                            <button
                                type="button"
                                onClick={() => handleSectionDelete('skills', skill.id, index)}
                                className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out mt-4">
                                <FaTrashAlt className="inline-block mr-2"/> Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleSectionAdd('skills')}
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

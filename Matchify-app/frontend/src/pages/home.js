import React, { useEffect, useState } from 'react';
import { BuildingOfficeIcon, DocumentIcon, LightBulbIcon, PuzzlePieceIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, MapPinIcon, MagnifyingGlassIcon, BriefcaseIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/outline';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Home = ({ selectedJob, username}) => {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');  // Obtener el token almacenado
                const response = await axios.get(`http://localhost:3001/auth/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Enviar el token en los encabezados
                    },
                });
                setUserData(response.data);  // Asigna los datos del usuario
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error al obtener los datos del usuario');
            }
        };

        fetchData();
    }, [userId]);

    if (error) return <p>{error}</p>;
    if (!userData) return <p>Cargando...</p>;

    const handleViewCVClick = () => {
        // Lógica para ver CV
    };

    const renderApplyButton = () => {
        // Lógica para renderizar el botón de aplicación
    };


    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-grow p-6">
                <div className="flex justify-between items-center mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/images/Profile.jpg"
                            alt="Profile Picture"
                            className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-medium text-gray-900">¡Hola, {username}!</h1>
                            <p className="text-md text-gray-500 mt-1">Estamos listos para ayudarte a encontrar tu próximo reto</p>
                        </div>
                    </div>
                    <div>
                        <button className="px-5 py-2 bg-blue-600 text-white border border-gray-300 rounded-lg hover:bg-blue-700 transition focus:outline-none">
                            Editar Perfil
                        </button>
                    </div>
                </div>

                <div className="mt-6 h-[330px] overflow-y-auto pr-4">
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Descripción del trabajo</h3>
                    <p className="mt-6 text-gray-700 leading-relaxed text-md text-justify">
                        {selectedJob?.descripcion || "Descripción no disponible"}
                    </p>

                    <h3 className="text-xl md:text-2xl font-semibold mt-6 text-gray-800">Funciones Requeridas</h3>
                    <p className="mt-3 text-gray-700 leading-relaxed text-md text-justify">
                        {selectedJob?.Funciones_Requerimiento || "Funciones no disponibles"}
                    </p>

                    <h3 className="text-xl md:text-2xl font-semibold mt-6 text-gray-800">Estudios Requeridos</h3>
                    <p className="mt-3 text-gray-700 leading-relaxed text-md text-justify">
                        {selectedJob?.Estudios_Requerimiento || "Estudios no disponibles"}
                    </p>

                    <h3 className="text-xl md:text-2xl font-semibold mt-6 text-gray-800">Experiencia Requerida</h3>
                    <p className="mt-3 text-gray-700 leading-relaxed text-md text-justify">
                        {selectedJob?.Experiencia_Requerimiento || "Experiencia no disponible"}
                    </p>

                    <h3 className="text-xl md:text-2xl font-semibold mt-6 text-gray-800">Conocimientos Requeridos</h3>
                    <p className="mt-3 text-gray-700 leading-relaxed text-md text-justify">
                        {selectedJob?.Conocimientos_Requerimiento || "Conocimientos no disponibles"}
                    </p>

                    <h3 className="text-xl md:text-2xl font-semibold mt-6 text-gray-800">Competencias Requeridas</h3>
                    <p className="mt-3 text-gray-700 leading-relaxed text-md text-justify">
                        {selectedJob?.Competencias__Requerimiento || "Competencias no disponibles"}
                    </p>
                </div>

                {selectedJob?.empresa ? (
                    <div className="mt-12 space-y-2">
                        <h3 className="text-3xl font-bold text-gray-800">
                            <BuildingOfficeIcon className="h-8 w-8 inline-block text-blue-600 mr-3 "/>
                            Información de la Empresa
                        </h3>

                        <div className="p-6 bg-white text-blue-800 rounded-xl shadow-md flex items-center space-x-4">
                            <BuildingOfficeIcon className="h-6 w-6"/>
                            <div>
                                <p className="text-lg font-semibold">Nombre de la Empresa</p>
                                <p className="text-xl">{selectedJob.empresa?.nombre || 'Empresa no especificada'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white text-yellow-800 rounded-xl shadow-md flex items-center space-x-4">
                                <BuildingOfficeIcon className="h-6 w-6"/>
                                <div>
                                    <p className="text-lg font-semibold">Descripción</p>
                                    <p className="text-xl">{selectedJob.empresa?.descripcion || 'No especificada'}</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white text-green-800 rounded-xl shadow-md flex items-center space-x-4">
                                <MapPinIcon className="h-6 w-6"/>
                                <div>
                                    <p className="text-lg font-semibold">Dirección</p>
                                    <p className="text-xl">{selectedJob.empresa?.direccion || 'No especificada'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white text-indigo-800 rounded-xl shadow-md flex items-center space-x-4">
                            <GlobeAltIcon className="h-6 w-6"/>
                            <div>
                                <p className="text-lg font-semibold">Sitio Web</p>
                                {selectedJob.empresa?.sitioWeb ? (
                                    <a
                                        href={selectedJob.empresa?.sitioWeb}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl font-bold text-indigo-600 hover:underline"
                                    >
                                        {selectedJob.empresa?.sitioWeb}
                                    </a>
                                ) : (
                                    <p className="text-xl">No especificado</p>
                                )}
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-800">
                            <BuildingOfficeIcon className="h-8 w-8 inline-block text-blue-600 mr-3 mb-1 "/>
                            Información de Contacto
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white text-red-800 rounded-xl shadow-md flex items-center space-x-4">
                                <PhoneIcon className="h-6 w-6"/>
                                <div>
                                    <p className="text-lg font-semibold">Teléfono</p>
                                    <p className="text-xl">{selectedJob.empresa?.telefono || 'No especificado'}</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white text-purple-800 rounded-xl shadow-md flex items-center space-x-4">
                                <EnvelopeIcon className="h-6 w-6"/>
                                <div>
                                    <p className="text-lg font-semibold">Email</p>
                                    <p className="text-xl">{selectedJob.empresa?.email || 'No especificado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">Información de la empresa no disponible.</p>
                )}
            </main>
        </div>
    );
};

export default Home;

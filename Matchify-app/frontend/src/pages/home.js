import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Home = ({ username }) => {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [activeJobs, setActiveJobs] = useState([]);  // Estado para las ofertas activas
    const [selectedJob, setSelectedJob] = useState(null); // Estado para la oferta seleccionada
    const [activeTab, setActiveTab] = useState('oferta'); // Pestaña activa (oferta o empresa)
    const [applicationStatus, setApplicationStatus] = useState(null); // Estado de la aplicación
    const { userId } = useParams();

    // Función para obtener la información del usuario
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');  // Obtener el token almacenado
                const response = await axios.get(`http://localhost:3001/user/${userId}`, {
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

        // Función para obtener las ofertas activas de todas las empresas
        const fetchActiveJobs = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/job/active`);
                const jobs = response.data.ofertas;

                // Para cada oferta, obtenemos los datos de la empresa
                const jobsWithCompanyData = await Promise.all(
                    jobs.map(async (job) => {
                        try {
                            const companyResponse = await axios.get(`http://localhost:3001/company/${job.empresaId}`);
                            return {
                                ...job,
                                empresa: companyResponse.data.empresa, // Añadir la información de la empresa a cada oferta
                            };
                        } catch (error) {
                            console.error('Error fetching company data:', error);
                            return {
                                ...job,
                                empresa: null, // Si falla, asigna null a la empresa
                            };
                        }
                    })
                );

                setActiveJobs(jobsWithCompanyData); // Actualiza el estado con los datos de las ofertas incluyendo la empresa
            } catch (error) {
                console.error('Error fetching active job offers:', error);
                setError('Error al obtener las ofertas activas.');
            }
        };

        fetchData();
        fetchActiveJobs();
    }, [userId]);

    useEffect(() => {
        if (selectedJob) {
            const checkApplicationStatus = async () => {
                try {
                    const response = await axios.post(`http://localhost:3001/candidatos/check-application`, {
                        usuarioId: userId,
                        ofertaEmpleoId: selectedJob.id
                    });
                    setApplicationStatus(response.data.status);
                } catch (error) {
                    console.error('Error checking application status:', error);
                    setError('Error al verificar el estado de la aplicación.');
                }
            };

            checkApplicationStatus();
        }
    }, [selectedJob, userId]);

    // Función para aplicar a una oferta de empleo
    const applyToJob = async (ofertaEmpleoId) => {
        try {
            const response = await axios.post(`http://localhost:3001/candidatos/${userId}/apply`, {
                ofertaEmpleoId
            });
            if (response.data.success) {
                Swal.fire('Aplicación exitosa', 'Has aplicado a la oferta correctamente', 'success');
                setApplicationStatus('pendiente');
            } else {
                Swal.fire('Error', 'Hubo un problema al aplicar.', 'error');
                console.error("Error al aplicar:", response.data.message);
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al aplicar. Inténtalo de nuevo.', 'error');
            console.error("Error:", error.message);
        }
    };

    // Función para manejar la selección de un trabajo
    const handleJobClick = (job) => {
        setSelectedJob(job);
        setApplicationStatus(null); // Resetear estado al seleccionar un nuevo trabajo
    };

    // Renderizar detalles de la oferta seleccionada
    const renderOfferDetails = () => (
        <>
            <h3 className="text-lg font-semibold text-gray-700">Descripción del trabajo</h3>
            <p className="text-gray-600 mt-4">{selectedJob.descripcion}</p>
            <p className="text-gray-600 mt-4">Ubicación: {selectedJob.ubicacion}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="text-gray-900 font-semibold">
                    Salario: {selectedJob.salario ? `Q${selectedJob.salario}` : 'No especificado'}
                </span>
                <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full font-medium">
                    {selectedJob.tipoTrabajo || 'Tipo no especificado'}
                </span>
                <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full font-medium">
                    {selectedJob.modalidad || 'Modalidad no especificada'}
                </span>
            </div>
        </>
    );

    // Renderizar detalles de la empresa seleccionada
    const renderCompanyDetails = () => (
        <>
            <h3 className="text-lg font-semibold text-gray-700">Información de la Empresa</h3>
            <p className="text-gray-600 mt-4">{selectedJob.empresa?.descripcion || 'No especificada'}</p>
            <p className="text-gray-600 mt-4">Dirección: {selectedJob.empresa?.direccion || 'No especificada'}</p>
            <p className="text-gray-600 mt-4">Teléfono: {selectedJob.empresa?.telefono || 'No especificado'}</p>
            <p className="text-gray-600 mt-4">Sitio Web: {selectedJob.empresa?.sitioWeb ? (
                <a href={selectedJob.empresa?.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {selectedJob.empresa.sitioWeb}
                </a>
            ) : 'No especificado'}</p>
        </>
    );

    if (error) return <p>{error}</p>;
    if (!userData) return <p>Cargando...</p>;

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

                {/* Sección para mostrar todas las ofertas activas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg max-h-[780px] overflow-y-auto">
                        <div className="space-y-6">
                            {activeJobs.length > 0 ? (
                                activeJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        onClick={() => handleJobClick(job)}
                                        className={`cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg border transition duration-200 ${
                                            selectedJob && selectedJob.id === job.id ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-white">{job.titulo.charAt(0)}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-lg font-semibold text-gray-900 truncate">
                                                        {job.titulo.length > 20 ? `${job.titulo.substring(0, 20)}...` : job.titulo}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Aquí mostramos el nombre de la empresa en la tarjeta */}
                                        <p className="text-gray-900 font-bold">
                                            Compañía: {job.empresa?.nombre || 'No especificada'}
                                        </p>

                                        <p className="text-gray-500 mt-4 text-md">{job.descripcion}</p>
                                        <p className="mt-4 text-gray-800 font-bold text-md">Ubicación: {job.ubicacion}</p>
                                        <div className="mt-4 flex flex-wrap items-center gap-4 text-md">
                                            <span className="text-gray-900 font-semibold">
                                                Oferta Salarial: {job.salario ? `Q${job.salario}` : 'No especificado'}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center gap-3 text-md">
                                            <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full font-medium">
                                                {job.tipoTrabajo || 'Tipo no especificado'}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full font-medium">
                                                {job.modalidad || 'Modalidad no especificada'}
                                            </span>
                                            {job.tags?.map((tag, index) => (
                                                <span key={index} className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No se encontraron ofertas de trabajo</p>
                            )}
                        </div>
                    </div>

                    {selectedJob && (
                        <div
                            className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6 relative">
                            <div className="flex items-center mb-4">
                                <div
                                    className="mt-4 bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                    <span className="text-lg font-bold text-white">{selectedJob.titulo.charAt(0)}</span>
                                </div>
                                <h2 className="ml-4 mt-4 text-3xl font-bold text-gray-800">{selectedJob.titulo}</h2>
                            </div>

                            <div className="flex py-6 space-x-4">
                                <div className="px-6 py-4 bg-green-100 text-green-800 text-center rounded-2xl">
                                    <div className="text-sm">Salario</div>
                                    <div className="text-2xl font-bold">Q{selectedJob.salario} <span
                                        className="text-base font-normal">/Mes</span></div>
                                </div>
                                <div className="px-6 py-4 bg-blue-100 text-blue-800 text-center rounded-2xl">
                                    <div className="text-sm">Tipo de Empleo</div>
                                    <div
                                        className="text-2xl font-bold">{selectedJob.tipoTrabajo || 'No especificado'}</div>
                                </div>
                                <div className="px-6 py-4 bg-orange-100 text-orange-800 text-center rounded-2xl">
                                    <div className="text-sm">Modalidad</div>
                                    <div
                                        className="text-2xl font-bold">{selectedJob.modalidad || 'No especificada'}</div>
                                </div>
                            </div>

                            <div className="mb-6 border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('oferta')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md ${
                                            activeTab === 'oferta'
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Información de la oferta
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('empresa')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md ${
                                            activeTab === 'empresa'
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Información de la empresa
                                    </button>
                                </nav>
                            </div>

                            {/* Mostrar detalles de la oferta o empresa */}
                            {activeTab === 'oferta' ? renderOfferDetails() : renderCompanyDetails()}

                            {/* Botón fijo para aplicar o ver el estado de la aplicación */}
                            <div className="absolute bottom-6 left-6 right-6">
                                {applicationStatus && applicationStatus.estado ? (
                                    <button
                                        className={`w-full px-6 py-4 rounded-lg text-white ${
                                            applicationStatus.estado === 'pendiente'
                                                ? 'bg-yellow-500'
                                                : applicationStatus.estado === 'aceptada'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                        } cursor-not-allowed`}
                                        disabled
                                    >
                                        {`Estado de aplicación: ${
                                            applicationStatus.estado === 'pendiente'
                                                ? 'Solicitud Pendiente'
                                                : applicationStatus.estado === 'aceptada'
                                                    ? 'Solicitud Aceptada'
                                                    : 'Solicitud Rechazada'
                                        }`}
                                    </button>
                                ) : (
                                    <button
                                        className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                                        onClick={() => applyToJob(selectedJob.id)}
                                    >
                                        Aplicar a esta oferta
                                    </button>
                                )}
                            </div>


                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;

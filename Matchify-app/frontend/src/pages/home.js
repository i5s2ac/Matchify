import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = ({ username }) => {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [activeJobs, setActiveJobs] = useState([]);  // Estado para las ofertas activas
    const [selectedJob, setSelectedJob] = useState(null); // Estado para la oferta seleccionada
    const [activeTab, setActiveTab] = useState('oferta'); // Pestaña activa (oferta o empresa)
    const [applicationStatus, setApplicationStatus] = useState(null); // Estado de la aplicación
    const { userId } = useParams();
    const [stats, setStats] = useState({ aceptadas: 0, rechazadas: 0, pendientes: 0 });
    const [filteredJobs, setFilteredJobs] = useState([]);

    const fetchActiveJobs = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/job/active`);
            const jobs = response.data.ofertas;

            const jobsWithCompanyData = await Promise.all(
                jobs.map(async (job) => {
                    try {
                        const companyResponse = await axios.get(`http://localhost:3001/company/${job.empresaId}`);
                        return {
                            ...job,
                            empresa: companyResponse.data.empresa,
                        };
                    } catch (error) {
                        console.error('Error fetching company data:', error);
                        return {
                            ...job,
                            empresa: null,
                        };
                    }
                })
            );

            setActiveJobs(jobsWithCompanyData);
        } catch (error) {
            console.error('Error fetching active job offers:', error);
            setError('Error al obtener las ofertas activas.');
        }
    };
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
                setUserData(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error al obtener los datos del usuario');
            }
        };

        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/candidatos/${userId}/application-counts`);
                const counts = response.data.counts;
                const formattedStats = {
                    aceptadas: counts.find(c => c.estado === 'aceptada')?.cantidad || 0,
                    rechazadas: counts.find(c => c.estado === 'rechazada')?.cantidad || 0,
                    pendientes: counts.find(c => c.estado === 'pendiente')?.cantidad || 0
                };
                setStats(formattedStats);
            } catch (error) {
                setError('Error al obtener las estadísticas');
            }
        };

        fetchStats();
        fetchData();
        fetchActiveJobs();
    }, [userId]);

    // Datos del gráfico de barras
    const data = {
        labels: ['Aceptadas', 'Pendientes', 'Rechazadas'],
        datasets: [
            {
                label: 'Estado de Solicitudes',
                data: [stats.aceptadas, stats.pendientes, stats.rechazadas],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], // Colores para las barras
                borderColor: ['#388E3C', '#FFA000', '#D32F2F'],
                borderWidth: 1,
            },
        ],
    };

    const [filters, setFilters] = useState({
        titulo: '',
        ubicacion: '',
        salario: '',
        tipoTrabajo: '',
        modalidad: '',
        fechaPublicacion: '',
    });

    // Filtrar las ofertas de empleo
    useEffect(() => {
        let filtered = activeJobs;

        if (filters.titulo) {
            filtered = filtered.filter((job) => job.titulo.toLowerCase().includes(filters.titulo.toLowerCase()));
        }

        if (filters.ubicacion) {
            filtered = filtered.filter((job) => job.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase()));
        }

        if (filters.salario) {
            filtered = filtered.filter((job) => parseFloat(job.salario) <= parseFloat(filters.salario));
        }

        if (filters.tipoTrabajo) {
            filtered = filtered.filter((job) => job.tipoTrabajo === filters.tipoTrabajo);
        }

        if (filters.modalidad) {
            filtered = filtered.filter((job) => job.modalidad === filters.modalidad);
        }

        if (filters.fecha) {
            const today = new Date();
            filtered = filtered.filter((job) => {
                const jobDate = new Date(job.fechaPublicacion);
                const diffInDays = Math.ceil((today - jobDate) / (1000 * 60 * 60 * 24));

                if (filters.fecha === '7') {
                    return diffInDays <= 7;
                } else if (filters.fecha === '30') {
                    return diffInDays <= 30;
                } else {
                    return diffInDays > 30;
                }
            });
        }

        setFilteredJobs(filtered);
    }, [filters, activeJobs]);

    useEffect(() => {
        fetchActiveJobs();  // Llamar a fetchActiveJobs aquí
    }, [userId]);

    // Función para manejar los cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };


    // Opciones de configuración del gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false, // Quita las líneas de la cuadrícula en el eje Y
                },
            },
            x: {
                grid: {
                    display: false, // Quita las líneas de la cuadrícula en el eje X
                },
            },
        },
    };


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
    if (!userData) return <p>Cargando...</p>






    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-grow p-6">


                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

                    <div
                        className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative flex flex-col justify-between">
                        <div className="flex items-center space-x-6 mb-4">
                            <img
                                src="/images/Profile.jpg"
                                alt="Profile"
                                className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover"
                            />
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">¡Hola, {userData?.username}!</h1>
                                <p className="text-md text-gray-500 ">Estamos listos para ayudarte a encontrar tu
                                    próximo reto</p>
                            </div>
                        </div>

                        <div className="mt-6">


                            {/* Barra de progreso */}
                            <div className="mt-6">
                                <p className="text-sm font-medium text-gray-500">Progreso de tu perfil</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                                    {/* Puedes ajustar el porcentaje */}
                                </div>
                            </div>

                            {/* Cita motivacional */}
                            <div className="mt-6">
                                <blockquote className="italic text-gray-500">"El éxito no se mide por lo que logras,
                                    sino por los obstáculos que superas."
                                </blockquote>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-4">
                            <button
                                onClick={() => alert("Editar Perfil")}
                                className="bg-blue-600 flex-1 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Editar Perfil
                            </button>

                            <button
                                onClick={() => alert("Cerrar Sesión")}
                                className="bg-red-600 flex-1 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>


                    {/* Gráfica de barras */}
                    <div
                        className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 relative flex flex-col justify-between">
                        {/* Título */}
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-blue-500 rounded-full h-12 w-12 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">ES</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Estado de Solicitudes</h2>
                                    <p className="text-gray-500">Revisión de candidaturas</p>
                                </div>
                            </div>

                            {/* Gráfico de barras */}
                            <div className="my-12">
                                <Bar data={data} options={options}/>
                            </div>
                        </div>

                        {/* Botón fijo */}
                        <button
                            onClick={() => alert("Ver más detalles")}
                            className="bg-blue-600 text-white w-full py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Ver más detalles
                        </button>
                    </div>

                    <div className="grid grid-rows-1 sm:grid-rows-2 gap-6 ">

                        {/* Tarjeta de Revisar CV */}
                        <div
                            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 relative flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div
                                        className="bg-indigo-500 rounded-full h-12 w-12 flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">CV</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">Revisa tu CV</h2>
                                        <p className="text-gray-500">Asegúrate de que tu CV esté actualizado.</p>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <p className="text-gray-600 mb-6 text-lg">
                                    Una revisión rápida de tu CV podría marcar la diferencia. Asegúrate de tener tus
                                    habilidades
                                    y experiencia bien destacadas.
                                </p>
                            </div>

                            {/* Botón fijo */}
                            <button
                                onClick={() => alert("Revisar CV")}
                                className="bg-indigo-600 text-white w-full py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Revisar CV
                            </button>
                        </div>

                        {/* Tarjeta de Consejo de Trabajo */}
                        <div
                            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 relative flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div
                                        className="bg-orange-500 rounded-full h-12 w-12 flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">Tip</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">Consejo de Trabajo</h2>
                                        <p className="text-gray-500">Aumenta tus oportunidades laborales</p>
                                    </div>
                                </div>

                                {/* Consejo */}
                                <p className="text-gray-600 mb-6 text-lg">
                                    "La clave para una entrevista exitosa es investigar la empresa. Conocer sus valores
                                    y
                                    metas
                                    te ayudará a conectar mejor con los reclutadores."
                                </p>
                            </div>

                            {/* Botón fijo */}
                            <button
                                onClick={() => alert("Más tips")}
                                className="bg-orange-600 text-white w-full py-3 rounded-lg hover:bg-orange-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Ver más consejos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="titulo"
                        placeholder="Buscar por Título de la Plaza"
                        value={filters.titulo}
                        onChange={handleFilterChange}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                    />

                    <input
                        type="text"
                        name="ubicacion"
                        placeholder="Buscar por Ubicación"
                        value={filters.ubicacion}
                        onChange={handleFilterChange}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                    />

                    <select
                        type="number"
                        name="salario"
                        placeholder="Filtrar por salario máximo"
                        value={filters.salario}
                        onChange={handleFilterChange}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Filtrar por salario máximo</option>
                        <option value="5000">Q5,000 o menos</option>
                        <option value="10000">Q10,000 o menos</option>
                        <option value="20000">Q20,000 o menos</option>
                        <option value="100000">Q100,000 o menos</option>
                        <option value="500000">Q500,000 o menos</option>
                    </select>
                </div>

                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    <select
                        name="tipoTrabajo"
                        value={filters.tipoTrabajo}
                        onChange={handleFilterChange}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Filtrar por tipo de trabajo</option>
                        <option value="Tiempo Completo">Tiempo Completo</option>
                        <option value="Tiempo Parcial">Tiempo Parcial</option>
                        <option value="Por Proyecto">Por Proyecto</option>
                    </select>

                    <select
                        name="modalidad"
                        value={filters.modalidad}
                        onChange={handleFilterChange}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Filtrar por modalidad</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Remoto">Remoto</option>
                        <option value="Híbrido">Híbrido</option>
                    </select>

                    <select
                        name="fecha"
                        value={filters.fecha}
                        onChange={handleFilterChange}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Filtrar por fecha</option>
                        <option value="7">Últimos 7 días</option>
                        <option value="30">Últimos 30 días</option>
                        <option value="over30">Más de 30 días</option>
                    </select>
                </div>





                {/* Sección para mostrar todas las ofertas activas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white rounded-lg max-h-[730px] overflow-y-auto">
                        <div className="space-y-6">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl border transition duration-200 ${
                                            selectedJob && selectedJob.id === job.id ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                        onClick={() => handleJobClick(job)}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div
                                                    className="bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                                    <span
                                                        className="text-lg font-bold text-white">{job.titulo.charAt(0)}</span>
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
                                            <span
                                                className="px-3 py-1 bg-green-200 text-green-700 rounded-full font-medium">
                                                {job.tipoTrabajo || 'Tipo no especificado'}
                                            </span>
                                            <span
                                                className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full font-medium">
                                                {job.modalidad || 'Modalidad no especificada'}
                                            </span>
                                            {job.tags?.map((tag, index) => (
                                                <span key={index}
                                                      className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full font-medium">
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
                            className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-xl border border-gray-200 p-6 relative">
                            <div className="flex items-center mb-4">
                                <div
                                    className="mt-4 bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                        <span
                                            className="text-lg font-bold text-white">{selectedJob.titulo.charAt(0)}</span>
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

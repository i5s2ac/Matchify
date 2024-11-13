import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    PencilIcon, UserIcon, EyeIcon, CheckIcon, XMarkIcon,
    TrashIcon, PlusCircleIcon, MagnifyingGlassIcon, CalendarIcon,
    CurrencyDollarIcon, BriefcaseIcon
} from '@heroicons/react/24/solid';
import Modal from 'react-modal';

Modal.setAppElement('#root');  // O el ID de tu div principal

const MySwal = withReactContent(Swal);

const CompanyHome = () => {
    const { userId, empresaId, rolId } = useParams();
    const [userData, setUserData] = useState(null);
    const [jobOffers, setJobOffers] = useState([]);
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [historyCandidates, setHistoryCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [activeJobCount, setActiveJobCount] = useState(0);
    const [inactiveJobCount, setInactiveJobCount] = useState(0);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [selectedCV, setSelectedCV] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);

    // Referencias para evitar llamadas duplicadas
    const hasFetchedJobOffers = useRef(false);
    const hasFetchedCandidates = useRef(false);
    const hasFetchedUser = useRef(false);

    const openModal = async (candidatoId, username) => {
        console.log(`Abriendo modal para el candidato con ID: ${candidatoId}`);
        const cv = await fetchCV(candidatoId);
        if (cv) {
            setSelectedCV({ ...cv, username });
            setIsOpen(true);
            console.log("Modal abierto");
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedCV(null);
    };

    const fetchJobOffers = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/job/company`, { params: { empresaId, userId } });
            const data = response.data;

            if (data.success) {
                // Iterar sobre cada oferta y obtener el conteo de candidatos aplicados
                const ofertasConConteo = await Promise.all(
                    data.ofertas.map(async (offer) => {
                        try {
                            const countResponse = await axios.get(`http://localhost:3001/job/${offer.id}/candidate-count`);
                            const candidateCount = countResponse.data.candidateCount || 0;
                            return { ...offer, candidateCount };
                        } catch (error) {
                            console.error(`Error al obtener el conteo de candidatos para la oferta ${offer.id}:`, error);
                            return { ...offer, candidateCount: 0 };
                        }
                    })
                );

                setJobOffers(ofertasConConteo);
                setActiveJobCount(ofertasConConteo.filter(offer => offer.estatus === 'Activo').length);
                setInactiveJobCount(ofertasConConteo.filter(offer => offer.estatus === 'Inactivo').length);
            } else {
                setError('No se encontraron ofertas de empleo.');
            }
        } catch (error) {
            setError('Error al obtener las ofertas de empleo.');
            console.error('Error al obtener las ofertas:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCV = async (candidatoId) => {
        try {
            const response = await axios.get(`http://localhost:3001/cv/candidato/${candidatoId}/cv`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener el CV del candidato:', error);
            return null;
        }
    };

    const fetchCandidates = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/candidatos/candidates`, {
                params: { empresaId }
            });
            const data = response.data;

            if (data.success) {
                setPendingCandidates(data.candidatos.filter(c => c.estado === 'pendiente'));
                setHistoryCandidates(data.candidatos.filter(c => c.estado !== 'pendiente'));
            } else {
                setError('No se encontraron candidatos.');
            }
        } catch (error) {
            setError('Error al obtener los candidatos.');
            console.error('Error al obtener los candidatos:', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (hasFetchedUser.current) return; // Evitar llamada duplicada
            hasFetchedUser.current = true;

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

        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchOffersAndCandidates = async () => {
            if (!hasFetchedJobOffers.current) {
                await fetchJobOffers();
                hasFetchedJobOffers.current = true;
            }
            if (!hasFetchedCandidates.current) {
                await fetchCandidates();
                hasFetchedCandidates.current = true;
            }
        };

        fetchOffersAndCandidates();
    }, [empresaId, userId]);

    // Función para actualizar el estado de un candidato
    const handleUpdateCandidato = async (candidatoId, nuevoEstado) => {
        try {
            await axios.put(`http://localhost:3001/candidatos/update-status`, { candidatoId, estado: nuevoEstado });
            Swal.fire('Actualizado', 'El estado del candidato ha sido actualizado.', 'success');
            fetchCandidates(); // Actualizar la lista de candidatos
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar el estado del candidato.', 'error');
            console.error('Error al actualizar candidato:', error);
        }
    };

    // Función para manejar la eliminación de una oferta
    const handleDelete = async (offerId) => {
        try {
            const result = await MySwal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás revertir esta acción.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3001/job/delete/${offerId}`);
                MySwal.fire('Eliminado', 'La oferta de trabajo ha sido eliminada.', 'success');
                setJobOffers(jobOffers.filter((offer) => offer.id !== offerId));
            }
        } catch (error) {
            MySwal.fire('Error', 'Hubo un error al eliminar la oferta.', 'error');
            console.error('Error al eliminar la oferta:', error);
        }
    };

    // Función para alternar el estado de una oferta
    const handleToggleStatus = async (offerId, currentStatus) => {
        const newStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';

        try {
            await axios.put(`http://localhost:3001/job/toggle-status/${offerId}`, { estatus: newStatus });
            MySwal.fire({
                title: 'Estado cambiado exitosamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });

            setJobOffers(jobOffers.map((offer) =>
                offer.id === offerId ? { ...offer, estatus: newStatus } : offer
            ));
        } catch (error) {
            MySwal.fire('Error', 'Hubo un error al cambiar el estado.', 'error');
            console.error('Error al cambiar el estado:', error);
        }
    };

    const calcularDiasDesdePublicacion = (fecha) => {
        const fechaPublicacion = new Date(fecha);
        const fechaActual = new Date();
        const diferenciaDias = Math.floor((fechaActual - fechaPublicacion) / (1000 * 60 * 60 * 24));
        return diferenciaDias;
    };

    const handleCreateOfferClick = () => {
        navigate(`/home/${userId}/${empresaId}/${rolId}/create_offer`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtrado de candidatos
    const filteredPendingCandidatesList = pendingCandidates.filter((candidate) =>
        candidate.ofertaEmpleo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.candidato.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.ofertaEmpleo.salario.toString().includes(searchTerm.toLowerCase())
    );

    const filteredHistoryCandidatesList = historyCandidates.filter((candidate) =>
        candidate.ofertaEmpleo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.candidato.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.ofertaEmpleo.salario.toString().includes(searchTerm.toLowerCase())
    );

    // Filtrar candidatos por oferta
    const handleRevisarCandidatos = (offerId) => {
        setSelectedOfferId(offerId === selectedOfferId ? null : offerId); // Toggle del filtro
    };

    const filteredPending = selectedOfferId
        ? filteredPendingCandidatesList.filter((candidato) => candidato.ofertaEmpleo.id === selectedOfferId)
        : filteredPendingCandidatesList;

    const filteredHistory = selectedOfferId
        ? filteredHistoryCandidatesList.filter((candidato) => candidato.ofertaEmpleo.id === selectedOfferId)
        : filteredHistoryCandidatesList;

    const [filters, setFilters] = useState({
        salario: '',
        ubicacion: '',
        tipoTrabajo: '',
        titulo: '',
    });

    const [dateFilter, setDateFilter] = useState('');
    const [salaryFilter, setSalaryFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [modalityFilter, setModalityFilter] = useState('');

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

// Filtrar ofertas de empleo basado en los filtros
    const filteredJobOffers = jobOffers.filter((offer) => {
        const daysAgo = (new Date() - new Date(offer.fechaPublicacion)) / (1000 * 60 * 60 * 24);

        return (
            (salaryFilter === '' || parseFloat(offer.salario) <= parseFloat(salaryFilter)) &&
            (filters.ubicacion === '' || offer.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase())) &&
            (typeFilter === '' || offer.tipoTrabajo.toLowerCase().includes(typeFilter.toLowerCase())) &&
            (modalityFilter === '' || offer.modalidad.toLowerCase() === modalityFilter.toLowerCase()) &&
            (filters.titulo === '' || offer.titulo.toLowerCase().includes(filters.titulo.toLowerCase())) &&
            (dateFilter === '' ||
                (dateFilter === '7' && daysAgo <= 7) ||
                (dateFilter === '30' && daysAgo <= 30) ||
                (dateFilter === 'over30' && daysAgo > 30))
        );
    });

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }


    return (
        <div className="min-h-screen flex flex-col bg-white">


            <main className="flex-grow p-6">

                {/* Tarjeta de bienvenida */}
                <div
                    className="flex justify-between items-center mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">

                    <div className="flex items-center space-x-4">
                        <img
                            src="/images/Profile.jpg"
                            alt="Profile Picture"
                            className="h-16 w-16 rounded-full border-2 border-blue-500 object-cover shadow-md mr-4"
                        />

                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">¡Hola, {userData?.username}!</h1>
                            <p className="text-md text-gray-500 mt-1">Estamos listos para ayudarte a encontrar tu
                                próximo reto</p>
                        </div>
                    </div>
                    <Link to={`/editprofile/${userId}`}>
                        <button
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Editar Perfil
                        </button>
                    </Link>
                </div>

                {/* Tarjetas de Resumen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {/* Tarjeta de Crear Trabajo */}
                    <div
                        className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 relative flex flex-col justify-between transform hover:-translate-y-1">
                        <div className="flex-grow">
                            <div className="flex items-center space-x-3 mb-4">
                                <PlusCircleIcon className="h-14 w-14 text-blue-600"/>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Crear Plazas</h2>
                                    <p className="text-gray-500">Actualmente abiertas</p>
                                </div>

                            </div>
                            <p className="text-gray-600 mb-6 text-lg">
                                Publica una nueva oferta de trabajo y encuentra el candidato ideal para tu empresa.
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleCreateOfferClick}
                                className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Crear Trabajo
                            </button>
                        </div>
                    </div>

                    {/* Tarjeta de Plazas Activas */}
                    <div
                        className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-2xl hover:border-green-500 transition-all duration-300 relative flex flex-col justify-between transform hover:-translate-y-1">
                        <div className="flex-grow">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-green-500 rounded-full h-12 w-12 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">{activeJobCount}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Plazas Activas</h2>
                                    <p className="text-gray-500">Actualmente abiertas</p>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[125px]">
                                {activeJobCount === 0 ? (
                                    <p className="text-gray-600">Actualmente no cuentas con plazas activas.</p>
                                ) : (
                                    jobOffers
                                        .filter(offer => offer.estatus === 'Activo')
                                        .map((job) => (
                                            <div key={job.id} className="mb-3">
                                                <p className="text-gray-800 font-medium">{job.titulo}</p>
                                                <p className="text-gray-500 text-sm">Publicado
                                                    hace {calcularDiasDesdePublicacion(job.fechaPublicacion)} días</p>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => alert("Ver todas las plazas activas")}
                                className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Ver todas las plazas activas
                            </button>
                        </div>
                    </div>

                    {/* Tarjeta de Plazas Inactivas */}
                    <div
                        className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-2xl hover:border-red-500 transition-all duration-300 relative flex flex-col justify-between transform hover:-translate-y-1">
                        <div className="flex-grow">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-red-500 rounded-full h-12 w-12 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">{inactiveJobCount}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Plazas Inactivas</h2>
                                    <p className="text-gray-500">Cerradas o vencidas</p>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[80px]">
                                {inactiveJobCount === 0 ? (
                                    <p className="text-gray-600">Actualmente no cuentas con plazas inactivas o
                                        vencidas.</p>
                                ) : (
                                    jobOffers
                                        .filter(offer => offer.estatus === 'Inactivo')
                                        .map((job) => (
                                            <div key={job.id} className="mb-3">
                                                <p className="text-gray-800 font-medium">{job.titulo}</p>
                                                <p className="text-gray-500 text-sm">Publicado
                                                    hace {calcularDiasDesdePublicacion(job.fechaPublicacion)} días</p>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => alert("Ver todas las plazas inactivas")}
                                className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Ver todas las plazas inactivas
                            </button>
                        </div>
                    </div>

                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mt-3 mb-3">Filtros Variados</h2>
                <p className="text-md text-gray-500 mb-7">Filtra las plazas por ubicación, categoria o por fecha.</p>

                {/* Filtros */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {/* Input para buscar por título de la plaza */}
                    <div className="relative">
                        <MagnifyingGlassIcon
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        />
                        <input
                            type="text"
                            name="titulo"
                            placeholder="Buscar por Título de la Plaza"
                            value={filters.titulo}
                            onChange={handleFilterChange}
                            className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Input para buscar por ubicación */}
                    <div className="relative">
                        <MagnifyingGlassIcon
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        />
                        <input
                            type="text"
                            name="ubicacion"
                            placeholder="Buscar por Ubicación"
                            value={filters.ubicacion}
                            onChange={handleFilterChange}
                            className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                    {/* Filtro de salario */}
                    <div className="relative">
                        <CurrencyDollarIcon
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        />
                        <select
                            className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                            value={salaryFilter}
                            onChange={(e) => setSalaryFilter(e.target.value)}
                        >
                            <option value="">Filtrar por salario máximo</option>
                            <option value="5000">Q5,000 o menos</option>
                            <option value="10000">Q10,000 o menos</option>
                            <option value="20000">Q20,000 o menos</option>
                            <option value="100000">Q100,000 o menos</option>
                            <option value="500000">Q500,000 o menos</option>
                        </select>
                    </div>

                    {/* Filtro de fecha */}
                    <div className="relative">
                        <CalendarIcon
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        />
                        <select
                            className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option value="">Filtrar por fecha de publicación</option>
                            <option value="7">Últimos 7 días</option>
                            <option value="30">Últimos 30 días</option>
                            <option value="over30">Más de 30 días</option>
                        </select>
                    </div>

                    {/* Filtro de tipo de trabajo */}
                    <div className="relative">
                        <BriefcaseIcon
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        />
                        <select
                            className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">Filtrar por tipo de trabajo</option>
                            <option value="Tiempo Completo">Tiempo Completo</option>
                            <option value="Tiempo Parcial">Tiempo Parcial</option>
                            <option value="Por Proyecto">Por Proyecto</option>
                        </select>
                    </div>

                    {/* Filtro de modalidad */}
                    <div className="relative">
                        <BriefcaseIcon
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        />
                        <select
                            className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                            value={modalityFilter}
                            onChange={(e) => setModalityFilter(e.target.value)}
                        >
                            <option value="">Filtrar por modalidad</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Virtual">Virtual</option>
                            <option value="Híbrido">Híbrido</option>
                        </select>
                    </div>
                </div>


                <div className="flex flex-wrap md:flex-nowrap w-full">

                    <div className="w-full md:w-1/3 pr-4">
                        <div>
                            {loading ? (
                                <p className="text-gray-600">Cargando ofertas de empleo...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mt-3 mb-3">Ofertas de
                                        Empleo</h2>
                                    <p className="text-md text-gray-500 mb-7">Administra las ofertas de empleo creadas
                                        por ti.</p>
                                    {filteredJobOffers.length === 0 ? (
                                        <p className="text-gray-600 border border-gray-200 p-3 mt-4 rounded-md">
                                            No se encontraron ofertas de trabajo con los filtros seleccionados.
                                        </p>
                                    ) : (
                                        <ul className="space-y-6 max-h-[660px] overflow-y-auto pr-4">
                                            {filteredJobOffers.map((offer) => (
                                                <li key={offer.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="bg-purple-600 rounded-md h-12 w-12 flex items-center justify-center">
                                                <span className="text-lg font-bold text-white">
                                                    {offer.titulo.charAt(0)}
                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                                    {offer.titulo.length > 20 ? `${offer.titulo.substring(0, 20)}...` : offer.titulo}
                                                                </h3>
                                                                <p className="text-gray-500 text-sm">
                                                                    {offer.candidateCount} {offer.candidateCount === 1 ? 'candidato ha aplicado' : 'candidatos han aplicado'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                to={`/home/${userId}/${empresaId}/${rolId}/edit_offer/${offer.id}`}
                                                                className="text-blue-600 hover:text-blue-800 transition"
                                                            >
                                                                <PencilIcon className="h-5 w-5"/>
                                                            </Link>
                                                            <button onClick={() => handleDelete(offer.id)}
                                                                    className="text-red-600 hover:text-red-800 transition">
                                                                <TrashIcon className="h-5 w-5"/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mb-4 text-md">
                                                        {offer.descripcion.length > 100 ? `${offer.descripcion.substring(0, 100)}...` : offer.descripcion}
                                                    </p>
                                                    <p className="text-gray-500 mb-4 text-md">Modalidad: {offer.modalidad}</p>
                                                    <p className="text-gray-500 mb-4 text-md">Tipo de
                                                        empleo: {offer.tipoTrabajo}</p>
                                                    <div className="text-md font-bold text-gray-600 mb-4">
                                                        {`Q${parseFloat(offer.salario).toLocaleString()}`}
                                                    </div>
                                                    <div className="mt-6 flex flex-wrap gap-2">
                                                        {offer.tags && (Array.isArray(offer.tags) ? offer.tags : offer.tags.split(',')).map((tag, index) => (
                                                            <span key={index}
                                                                  className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-0.5 rounded">
                                                {tag.trim()}
                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex space-x-2 mt-6 border-t border-gray-200 pt-4">
                                                        <button
                                                            onClick={() => handleRevisarCandidatos(offer.id)}
                                                            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                                        >
                                                            {selectedOfferId === offer.id ? 'Mostrar Todos' : 'Revisar Candidatos'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(offer.id, offer.estatus)}
                                                            className={`px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 ${
                                                                offer.estatus === 'Activo' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
                                                            }`}
                                                        >
                                                            {offer.estatus === 'Activo' ? 'Desactivar Trabajo' : 'Activar Trabajo'}
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 pl-4 mt-6 md:mt-0">
                        <h2 className="text-2xl font-semibold text-gray-800 mt-3">Candidatos</h2>
                        <p className="text-md text-gray-500 mt-3">Administra los candidatos para tus ofertas.</p>
                        <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border border-gray-200">

                            {/* Barra de búsqueda */}
                            <div className="mb-6 relative">
                                <MagnifyingGlassIcon
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Buscar candidatos, puestos, salarios..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300 ease-in-out hover:border-indigo-500"
                                />
                            </div>

                            <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`py-2 px-4 rounded-t-lg border-b-2 focus:outline-none ${
                                        activeTab === 'pending' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'
                                    }`}
                                >
                                    Candidatos Pendientes
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`py-2 px-4 rounded-t-lg focus:outline-none ${
                                        activeTab === 'history' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'
                                    }`}
                                >
                                    Historial de Candidatos
                                </button>
                            </div>

                            {loading ? (
                                <p>Cargando...</p>
                            ) : (
                                <div className="space-y-6 min-h-[500px] overflow-y-auto pr-4">

                                    {activeTab === 'pending' && filteredPending.length > 0 ? (
                                        <table className="min-w-full bg-white border">
                                            <thead>
                                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                                <th className="py-3 px-6 text-left">Nombre del Puesto</th>
                                                <th className="py-3 px-6 text-left">Salario</th>
                                                <th className="py-3 px-6 text-left">Foto</th>
                                                <th className="py-3 px-6 text-left">Candidato</th>
                                                <th className="py-3 px-6 text-left">Tags</th>
                                                <th className="py-3 px-6 text-left">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                            {filteredPending.map((candidato) => (
                                                <tr key={candidato.candidato.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-6">{candidato.ofertaEmpleo.titulo}</td>
                                                    <td className="py-3 px-6">Q{parseFloat(candidato.ofertaEmpleo.salario).toLocaleString()}</td>
                                                    <td className="py-3 px-6">
                                                        <img
                                                            src={candidato.candidato.foto || '/images/Profile.jpg'}
                                                            alt={candidato.candidato.username}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-6">{candidato.candidato.username}</td>
                                                    <td className="py-3 px-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            {candidato.ofertaEmpleo.tags.map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-0.5 rounded"
                                                                >
                                                    {tag}
                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-6 flex space-x-2">
                                                        <button
                                                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                                            onClick={() => openModal(candidato.candidato.id, candidato.candidato.username)}  // Pasa el ID y el username
                                                        >
                                                            <EyeIcon className="h-5 w-5 mr-1"/> Revisar
                                                        </button>

                                                        <button
                                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                                                            onClick={() => handleUpdateCandidato(candidato.id, 'aceptada')}
                                                        >
                                                            <CheckIcon className="h-5 w-5 mr-1"/> Aceptar
                                                        </button>

                                                        <button
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                                                            onClick={() => handleUpdateCandidato(candidato.id, 'rechazada')}
                                                        >
                                                            <XMarkIcon className="h-5 w-5 mr-1"/> Declinar
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : activeTab === 'pending' ? (
                                        <div className="flex flex-col items-center justify-center h-full w-full">
                                            <div className="flex flex-col items-center justify-center rounded-lg p-48">
                                                <UserIcon className="h-14 w-14 text-gray-400 mb-4"/>
                                                <h2 className="text-2xl font-semibold text-gray-700 mb-3">No hay
                                                    candidatos pendientes</h2>
                                                <p className="text-lg text-gray-500">Parece que aún no tienes candidatos
                                                    en espera para esta oferta.</p>
                                            </div>
                                        </div>
                                    ) : null}

                                    {activeTab === 'history' && filteredHistory.length > 0 ? (
                                        <table className="min-w-full bg-white border">
                                            <thead>
                                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                                <th className="py-3 px-6 text-left">Nombre del Puesto</th>
                                                <th className="py-3 px-6 text-left">Salario</th>
                                                <th className="py-3 px-6 text-left">Foto</th>
                                                <th className="py-3 px-6 text-left">Candidato</th>
                                                <th className="py-3 px-6 text-left">Estado</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                            {filteredHistory.map((candidato) => (
                                                <tr key={candidato.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-6">{candidato.ofertaEmpleo.titulo}</td>
                                                    <td className="py-3 px-6">Q{parseFloat(candidato.ofertaEmpleo.salario).toLocaleString()}</td>
                                                    <td className="py-3 px-6">
                                                        <img
                                                            src={candidato.candidato.foto || '/images/Profile.jpg'}
                                                            alt={candidato.candidato.username}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-6">{candidato.candidato.username}</td>
                                                    <td className="py-3 px-6">
                                        <span
                                            className={`px-3 py-2 rounded-full text-sm ${
                                                candidato.estado === 'aceptada' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}
                                        >
                                            {candidato.estado === 'aceptada' ? 'Aceptado' : 'Rechazado'}
                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : activeTab === 'history' ? (
                                        <div className="flex flex-col items-center justify-center h-full w-full">
                                            <div className="flex flex-col items-center justify-center rounded-lg p-48">
                                                <UserIcon className="h-14 w-14 text-gray-400 mb-4"/>
                                                <h2 className="text-2xl font-semibold text-gray-700 mb-3">No hay
                                                    candidatos en el historial</h2>
                                                <p className="text-lg text-gray-500">Parece que aún no tienes candidatos
                                                    en tu historial para esta oferta.</p>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal para mostrar el CV */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="CV del Candidato"
                    className="bg-white p-8 rounded-xl shadow-2xl max-w-5xl mx-auto my-8 w-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    {/* Título del modal con botón de cerrar */}
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-3xl font-bold text-gray-800">Perfil del Candidato</h2>
                        <button
                            onClick={closeModal}
                            className="text-gray-600 hover:text-gray-900 transition duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* Información general */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm flex items-center">
                        <img
                            src="/images/Profile.jpg"
                            alt="Profile Picture"
                            className="h-16 w-16 rounded-full border-2 border-blue-500 object-cover shadow-md mr-4"
                        />
                        <div>
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">Información General</h3>
                            <p className="text-gray-700"><strong>Nombre:</strong> {selectedCV?.username || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Secciones con scroll y tamaño fijo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Educación */}
                        <div className="p-4 bg-white rounded-lg shadow-sm h-40 overflow-y-auto">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Educación</h3>
                            {selectedCV?.educacion && selectedCV.educacion.length > 0 ? (
                                <ul className="list-none space-y-2">
                                    {selectedCV.educacion.map((edu, index) => (
                                        <li key={index} className="text-gray-600">
                                            <strong>{edu.titulo}</strong> - {edu.institucion}
                                            <br/>
                                            <span
                                                className="text-sm text-gray-500">{edu.fechaInicio} - {edu.fechaFin}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay datos de educación.</p>
                            )}
                        </div>

                        {/* Certificaciones */}
                        <div className="p-4 bg-white rounded-lg shadow-sm h-40 overflow-y-auto">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Certificaciones</h3>
                            {selectedCV?.certificaciones && selectedCV.certificaciones.length > 0 ? (
                                <ul className="list-none space-y-2">
                                    {selectedCV.certificaciones.map((cert, index) => (
                                        <li key={index} className="text-gray-600">
                                            <strong>{cert.nombre}</strong> - {cert.organizacionEmisora}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay datos de certificaciones.</p>
                            )}
                        </div>

                        {/* Experiencia Laboral */}
                        <div className="p-4 bg-white rounded-lg shadow-sm h-40 overflow-y-auto">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Experiencia Laboral</h3>
                            {selectedCV?.experienciaLaboral && selectedCV.experienciaLaboral.length > 0 ? (
                                <ul className="list-none space-y-2">
                                    {selectedCV.experienciaLaboral.map((exp, index) => (
                                        <li key={index} className="text-gray-600">
                                            <strong>{exp.titulo}</strong> - {exp.empresa}
                                            <br/>
                                            <span
                                                className="text-sm text-gray-500">{exp.fechaInicio} - {exp.fechaFin}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay datos de experiencia laboral.</p>
                            )}
                        </div>

                        {/* Idiomas */}
                        <div className="p-4 bg-white rounded-lg shadow-sm h-40 overflow-y-auto">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Idiomas</h3>
                            {selectedCV?.idiomas && selectedCV.idiomas.length > 0 ? (
                                <ul className="list-none space-y-2">
                                    {selectedCV.idiomas.map((idioma, index) => (
                                        <li key={index} className="text-gray-600">
                                            {idioma.nombre} - Nivel: {idioma.nivelDominio}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay datos de idiomas.</p>
                            )}
                        </div>

                        {/* Habilidades */}
                        <div className="p-4 bg-white rounded-lg shadow-sm h-40 overflow-y-auto">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Habilidades</h3>
                            {selectedCV?.skills && selectedCV.skills.length > 0 ? (
                                <ul className="list-none space-y-2">
                                    {selectedCV.skills.map((skill, index) => (
                                        <li key={index} className="text-gray-600">
                                            {skill.nombre} - Nivel: {skill.nivelDominio}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay datos de habilidades.</p>
                            )}
                        </div>
                    </div>
                </Modal>


            </main>
        </div>
    );
};

export default CompanyHome;

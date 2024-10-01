import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CompanyHome = () => {
    const { userId, empresaId, rolId } = useParams();
    const [jobOffers, setJobOffers] = useState([]);
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [historyCandidates, setHistoryCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // Pestaña activa
    const navigate = useNavigate();

    // Función para obtener las ofertas de empleo
    const fetchJobOffers = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/job/company`, { params: { empresaId, userId } });
            const data = response.data;
            if (data.success) {
                setJobOffers(data.ofertas);
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

    // Función para obtener candidatos pendientes e historial
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


    // Actualizar estado de candidato
    const handleUpdateCandidato = async (candidatoId, nuevoEstado) => {
        try {
            await axios.put(`http://localhost:3001/candidatos/update-status`, { candidatoId, estado: nuevoEstado });
            Swal.fire('Actualizado', 'El estado del candidato ha sido actualizado.', 'success');
            fetchCandidates(); // Volver a cargar la lista de candidatos
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar el estado del candidato.', 'error');
            console.error('Error al actualizar candidato:', error);
        }
    };

    useEffect(() => {
        fetchJobOffers();
        fetchCandidates();
    }, [empresaId, userId]);

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

    // Cambiar estado de la oferta (activar/desactivar)
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

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-white shadow p-6 mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Panel de Empresa</h1>
                <p className="text-gray-500">Bienvenido, usuario {userId}</p>
                <p className="text-gray-500">ID de la Empresa: {empresaId}</p>
                <p className="text-gray-500">ID del Rol: {rolId}</p>
            </header>

            <main className="flex-grow p-6">
                <div className="mb-6">
                    <Link to={`/home/${userId}/${empresaId}/${rolId}/create_offer`} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700">
                        Crear Nueva Oferta de Trabajo
                    </Link>
                </div>

                {loading ? (
                    <p className="text-gray-600">Cargando ofertas de empleo...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ofertas de Empleo Activas:</h2>
                        <ul className="space-y-6">
                            {jobOffers.map((offer) => (
                                <li key={offer.id} className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-gray-800">{offer.titulo}</h3>
                                    <p className="text-gray-600">{offer.descripcion}</p>
                                    <p className="text-gray-500">
                                        Publicado el: {new Date(offer.fechaPublicacion).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-500">Salario: {offer.salario}</p>
                                    <p className="text-gray-500">Modalidad: {offer.modalidad}</p>
                                    <p className="text-gray-500">Estatus: {offer.estatus}</p>

                                    <div className="mt-4 flex space-x-4">
                                        <Link to={`/home/${userId}/${empresaId}/${rolId}/edit_offer/${offer.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                                            Editar
                                        </Link>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={() => handleDelete(offer.id)}>
                                            Eliminar
                                        </button>
                                        <button onClick={() => handleToggleStatus(offer.id, offer.estatus)} className={`px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 ${offer.estatus === 'Activo' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                                            {offer.estatus === 'Activo' ? 'Desactivar Trabajo' : 'Activar Trabajo'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Sección de candidatos */}
                <div className="w-full md:w-2/3 pl-4 mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Candidatos</h2>
                    <p className="text-md text-gray-500 mt-3">Administra los candidatos para tus ofertas.</p>
                    <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border border-gray-200">
                        <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
                            <button onClick={() => setActiveTab('pending')} className={`py-2 px-4 rounded-t-lg border-b-2 focus:outline-none ${activeTab === 'pending' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'}`}>
                                Candidatos Pendientes
                            </button>
                            <button onClick={() => setActiveTab('history')} className={`py-2 px-4 rounded-t-lg focus:outline-none ${activeTab === 'history' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'}`}>
                                Historial de Candidatos
                            </button>
                        </div>

                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <div className="overflow-y-auto" style={{ maxHeight: '580px' }}>
                                {activeTab === 'pending' && pendingCandidates.length > 0 ? (
                                    <ul>
                                        {pendingCandidates.map(candidato => (
                                            <li key={candidato.id} className="border-b py-2">
                                                <p className="text-lg">{candidato.candidato.username}</p>
                                                <div className="flex space-x-2 mt-2">
                                                    <button onClick={() => handleUpdateCandidato(candidato.id, 'aceptada')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                                                        Aceptar
                                                    </button>
                                                    <button onClick={() => handleUpdateCandidato(candidato.id, 'rechazada')} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                                        Rechazar
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay candidatos pendientes.</p>
                                )}

                                {activeTab === 'history' && historyCandidates.length > 0 ? (
                                    <ul>
                                        {historyCandidates.map(candidato => (
                                            <li key={candidato.id} className="border-b py-2">
                                                <p className="text-lg">{candidato.candidato.username} - {candidato.estado}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay historial de candidatos.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyHome;

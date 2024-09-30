import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CompanyHome = () => {
    const { userId, empresaId, rolId } = useParams(); // Obtenemos los IDs desde la URL
    const [jobOffers, setJobOffers] = useState([]); // Estado para almacenar las ofertas de empleo
    const [loading, setLoading] = useState(true);   // Estado para el indicador de carga
    const [error, setError] = useState(null);       // Estado para errores
    const navigate = useNavigate();

    // Función para obtener las ofertas de empleo desde el backend usando axios
    const fetchJobOffers = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/job/company`, {
                params: { empresaId, userId },
            });

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

    useEffect(() => {
        fetchJobOffers();
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
                // Llamada al backend para eliminar la oferta
                await axios.delete(`http://localhost:3001/job/delete/${offerId}`);
                MySwal.fire('Eliminado', 'La oferta de trabajo ha sido eliminada.', 'success');

                // Actualizar la lista de ofertas eliminando la oferta que se acaba de borrar
                setJobOffers(jobOffers.filter((offer) => offer.id !== offerId));
            }
        } catch (error) {
            MySwal.fire('Error', 'Hubo un error al eliminar la oferta.', 'error');
            console.error('Error al eliminar la oferta:', error);
        }
    };

    // Función para manejar el cambio de estado de la oferta (activar/desactivar)
    const handleToggleStatus = async (offerId, currentStatus) => {
        const newStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';

        try {
            await axios.put(`http://localhost:3001/job/toggle-status/${offerId}`, { estatus: newStatus }); // Cambié '/update_status' por '/toggle-status'
            MySwal.fire({
                title: 'Estado cambiado exitosamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });

            // Actualizar la oferta en la lista
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
                {/* Botón para crear una nueva oferta */}
                <div className="mb-6">
                    <Link
                        to={`/home/${userId}/${empresaId}/${rolId}/create_offer`}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Crear Nueva Oferta de Trabajo
                    </Link>
                </div>

                {/* Indicador de carga */}
                {loading ? (
                    <p className="text-gray-600">Cargando ofertas de empleo...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div>
                        {/* Si hay ofertas, las mostramos */}
                        {jobOffers.length > 0 ? (
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

                                            {/* Botones de editar, eliminar y activar/desactivar */}
                                            <div className="mt-4 flex space-x-4">
                                                <Link
                                                    to={`/home/${userId}/${empresaId}/${rolId}/edit_offer/${offer.id}`}
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    onClick={() => handleDelete(offer.id)}
                                                >
                                                    Eliminar
                                                </button>

                                                <button
                                                    onClick={() => handleToggleStatus(offer.id, offer.estatus)}
                                                    className={`px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 ${
                                                        offer.estatus === 'Activo'
                                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                                            : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                                >
                                                    {offer.estatus === 'Activo' ? 'Desactivar Trabajo' : 'Activar Trabajo'}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-600">No hay ofertas de empleo activas.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CompanyHome;

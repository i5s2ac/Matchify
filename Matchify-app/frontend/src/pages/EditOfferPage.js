import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditOfferPage = () => {
    const { userId, empresaId, rolId, offerId } = useParams(); // Obtenemos el ID de la oferta y los otros parámetros
    const [offerData, setOfferData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        salario: '',
        fechaCierre: '',
        modalidad: '',
        tipoTrabajo: '',
        Funciones_Requerimiento: '',
        Estudios_Requerimiento: '',
        Experiencia_Requerimiento: '',
        Conocimientos_Requerimiento: '',
        Competencias_Requerimiento: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Función para formatear la fecha al formato yyyy-MM-dd
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Añadir ceros iniciales
        const day = (`0${date.getDate()}`).slice(-2); // Añadir ceros iniciales
        return `${year}-${month}-${day}`;
    };

    // Función para obtener los datos de la oferta a editar
    const fetchOfferData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/job/${offerId}`);
            const data = response.data;
            if (data.success) {
                setOfferData({
                    ...data.oferta,
                    fechaCierre: formatDate(data.oferta.fechaCierre), // Formatear la fecha de cierre correctamente
                });
            } else {
                setError('No se pudo cargar la oferta.');
            }
        } catch (error) {
            setError('Error al obtener los datos de la oferta.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferData();
    }, [offerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOfferData({ ...offerData, [name]: value });
    };

    // Función para manejar la actualización de la oferta
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/job/update/${offerId}`, offerData);
            MySwal.fire({
                title: 'Oferta actualizada exitosamente!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => {
                navigate(`/home/${userId}/${empresaId}/${rolId}`);
            }, 1500); // Redirige después de 1.5 segundos
        } catch (error) {
            console.error('Error al actualizar la oferta:', error);
            setError('Error al actualizar la oferta.');
            MySwal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar la oferta. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg">
            <div className="flex items-center mb-6">
                <ArrowLeftIcon
                    className="h-6 w-6 text-gray-700 cursor-pointer hover:text-primary transition"
                    onClick={() => navigate(-1)} // Utiliza navigate para ir a la página anterior
                />
                <h2 className="text-2xl font-semibold text-gray-800 ml-4 py-2">Editar oferta de trabajo</h2>
            </div>

            <main className="flex-grow p-6">
                {loading ? (
                    <p>Cargando datos de la oferta...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="titulo" className="block text-lg font-medium text-gray-700">Título</label>
                                <input
                                    type="text"
                                    id="titulo"
                                    name="titulo"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.titulo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="ubicacion" className="block text-lg font-medium text-gray-700">Ubicación</label>
                                <input
                                    type="text"
                                    id="ubicacion"
                                    name="ubicacion"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.ubicacion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-lg font-medium text-gray-700">
                                Descripción (255 caracteres)
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                maxLength="255"
                                className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                value={offerData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="salario" className="block text-lg font-medium text-gray-700">Salario</label>
                            <input
                                type="number"
                                id="salario"
                                name="salario"
                                className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                value={offerData.salario}
                                onChange={handleChange}
                                placeholder="Ej. 50000"
                                required
                            />
                        </div>

                        {/* Modalidad y Tipo de Trabajo */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="modalidad" className="block text-lg font-medium text-gray-700">Modalidad</label>
                                <select
                                    id="modalidad"
                                    name="modalidad"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.modalidad}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Presencial">Presencial</option>
                                    <option value="Hibrido">Híbrido</option>
                                    <option value="Remoto">Remoto</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tipoTrabajo" className="block text-lg font-medium text-gray-700">Tipo de trabajo</label>
                                <select
                                    id="tipoTrabajo"
                                    name="tipoTrabajo"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.tipoTrabajo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Tiempo Completo">Tiempo Completo</option>
                                    <option value="Tiempo Parcial">Tiempo Parcial</option>
                                    <option value="Por Proyecto">Por Proyecto</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="fechaCierre" className="block text-lg font-medium text-gray-700">Fecha de Cierre</label>
                                <input
                                    type="date"
                                    id="fechaCierre"
                                    name="fechaCierre"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.fechaCierre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Campos adicionales */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="Funciones_Requerimiento" className="block text-lg font-medium text-gray-700">
                                    Funciones Requerimiento
                                </label>
                                <textarea
                                    id="Funciones_Requerimiento"
                                    name="Funciones_Requerimiento"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.Funciones_Requerimiento}
                                    onChange={handleChange}
                                    placeholder="Describe las funciones requeridas para el puesto..."
                                />
                            </div>

                            <div>
                                <label htmlFor="Estudios_Requerimiento" className="block text-lg font-medium text-gray-700">
                                    Estudios Requerimiento
                                </label>
                                <input
                                    type="text"
                                    id="Estudios_Requerimiento"
                                    name="Estudios_Requerimiento"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.Estudios_Requerimiento}
                                    onChange={handleChange}
                                    placeholder="Ej. Ingeniería en Sistemas o afín."
                                />
                            </div>

                            <div>
                                <label htmlFor="Experiencia_Requerimiento" className="block text-lg font-medium text-gray-700">
                                    Experiencia Requerimiento
                                </label>
                                <input
                                    type="text"
                                    id="Experiencia_Requerimiento"
                                    name="Experiencia_Requerimiento"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.Experiencia_Requerimiento}
                                    onChange={handleChange}
                                    placeholder="Ej. 3 años en desarrollo backend."
                                />
                            </div>

                            <div>
                                <label htmlFor="Conocimientos_Requerimiento" className="block text-lg font-medium text-gray-700">
                                    Conocimientos Requerimiento
                                </label>
                                <textarea
                                    id="Conocimientos_Requerimiento"
                                    name="Conocimientos_Requerimiento"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.Conocimientos_Requerimiento}
                                    onChange={handleChange}
                                    placeholder="Enumera los conocimientos específicos necesarios..."
                                />
                            </div>

                            <div>
                                <label htmlFor="Competencias_Requerimiento" className="block text-lg font-medium text-gray-700">
                                    Competencias Requerimiento
                                </label>
                                <textarea
                                    id="Competencias_Requerimiento"
                                    name="Competencias_Requerimiento"
                                    className="mt-4 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                    value={offerData.Competencias_Requerimiento}
                                    onChange={handleChange}
                                    placeholder="Describe las competencias necesarias..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                        >
                            Actualizar Oferta
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
};

export default EditOfferPage;

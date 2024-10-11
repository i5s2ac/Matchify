import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ProfileEditPage = () => {
    const { userId } = useParams(); // Obtener el ID del usuario
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        telefono: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Función para obtener los datos del usuario a editar
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/user/${userId}`);
            const data = response.data;
            if (data.success) {
                setUserData(data.user);
            } else {
                setError('No se pudo cargar la información del usuario.');
            }
        } catch (error) {
            setError('Error al obtener los datos del usuario.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // Función para manejar la actualización del perfil del usuario
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/user/${userId}`, userData);
            MySwal.fire({
                title: 'Perfil actualizado exitosamente!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => {
                navigate(`/home/${userId}`);
            }, 1500); // Redirige después de 1.5 segundos
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setError('Error al actualizar el perfil.');
            MySwal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar el perfil. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white ">
            <div className="flex items-center mb-6">
                <ArrowLeftIcon
                    className="h-6 w-6 text-gray-700 cursor-pointer hover:text-primary transition"
                    onClick={() => navigate(-1)} // Utiliza navigate para ir a la página anterior
                />
                <h2 className="text-2xl font-semibold text-gray-800 ml-4 py-2">Editar Perfil</h2>
            </div>

            <main className="flex-grow p-6">
                {loading ? (
                    <p>Cargando datos del usuario...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-lg font-medium text-gray-700">Nombre de Usuario</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                value={userData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="telefono" className="block text-lg font-medium text-gray-700">Teléfono</label>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm"
                                value={userData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                        >
                            Actualizar Perfil
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
};

export default ProfileEditPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
                email,
                password,
            });
            console.log('Inicio de sesión exitoso:', response.data);
            const { userId, token, empresaId, rolId } = response.data;

            // Almacena el token y userId en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            // Solo almacena empresaId y rolId si existen
            if (empresaId) {
                localStorage.setItem('empresaId', empresaId);
            }
            if (rolId) {
                localStorage.setItem('rolId', rolId);
            }

            setIsAuthenticated(true);

            // Redirige a la página correspondiente
            if (empresaId && rolId) {
                navigate(`/home/${userId}/${empresaId}/${rolId}`);
            } else {
                navigate(`/home/${userId}`);
            }

        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-16">
                <div className="w-full max-w-md">
                    <h2 className="text-5xl font-bold mb-10 text-gray-800">Welcome back!</h2>
                    <p className="text-xl text-gray-600 mb-8">Enter your email address and password to access your account.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-red-600 text-lg">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Log In
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-8">
                        <p className="text-lg text-gray-700">Don't have an account? <a href="/register" className="text-primary font-medium hover:text-secondary">Register here.</a></p>
                    </div>
                </div>
            </div>

            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/Working.png')" }}></div>
        </div>
    );
}

export default Login;

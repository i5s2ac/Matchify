import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/auth/register', {
                username,
                email,
                password,
                phone,
            });
            // Manejar la respuesta de éxito, redirigir o mostrar un mensaje
            console.log('Registro exitoso:', response.data);
            navigate(`/login`);
        } catch (error) {
            // Manejar errores, por ejemplo, mostrar un mensaje
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error al registrarse. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-16">
                <div className="w-full max-w-md">
                    <h2 className="text-5xl font-bold mb-10 text-gray-800">Create an Account</h2>

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

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

                        <div>
                            <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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
                                Register
                            </button>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-lg text-gray-700">Already have an account? <a href="/login" className="text-primary font-medium hover:text-secondary">Log in here.</a></p>
                        </div>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-lg text-gray-700">Are you registering as a company? <a href="/register_enterprise" className="text-primary font-medium hover:text-secondary">Register your company here.</a></p>
                    </div>
                </div>
            </div>

            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/Team.png')" }}></div>
        </div>
    );
}

export default Register;

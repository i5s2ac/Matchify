import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate(); // Cambiado de history a navigate

    const handleRegisterClick = () => {
        navigate('/register'); // Redirige a la página de registro
    };

    const handleLoginClick = () => {
        navigate('/login'); // Redirige a la página de inicio de sesión
    };

    return (
        <div className="relative min-h-screen flex">
            <div className="w-1/2 bg-white flex flex-col justify-between text-black">
                <main className="flex-grow flex flex-col justify-center items-start px-8 md:px-16 lg:px-32">
                    <div className="max-w-lg">
                        <div
                            className="mb-8"
                            style={{
                                backgroundImage: "url('/images/Matchify_logo.png')",
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                width: "250px",
                                height: "100px",
                            }}
                        ></div>
                        <h2 className="text-5xl font-extrabold mb-4 leading-tight text-gray-800">
                            The best online recruitment and job search software
                        </h2>
                        <p className="text-lg text-gray-600 mb-12">
                            The best online recruitment and job search software streamlines hiring for employers and
                            simplifies job searching for candidates.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleRegisterClick}
                                className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={handleLoginClick}
                                className="px-6 py-3 bg-transparent border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition duration-300"
                            >
                                Log in into my account
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="w-full py-4 text-center text-gray-500">
                    &copy; 2024 TechStore. All rights reserved.
                </footer>
            </div>
            <div
                className="w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/Job_Recluit.png')",
                }}
            ></div>
        </div>
    );
}

export default HomePage;

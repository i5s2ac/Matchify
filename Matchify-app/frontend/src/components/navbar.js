import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, ChartPieIcon, DocumentIcon, CogIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = ({ userId, setIsAuthenticated, setUser, isCollapsed, setIsCollapsed, empresaId, rolId }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                try {
                    const response = await fetch(`http://localhost:3001/users/${userId}`);
                    if (!response.ok) {
                        throw new Error("Error al obtener el usuario");
                    }
                    const userData = await response.json();
                    setUsername(userData.username);
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        };
        fetchUser();
    }, [userId]);


    const handleDashboardClick = () => {
        if (empresaId && rolId) {
            navigate(`/home/${userId}/${empresaId}/${rolId}`);
        } else {
            navigate(`/home/${userId}`);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('empresaId');
        localStorage.removeItem('rolId');
        navigate('/');
    };

    return (
        <div className={`flex flex-col ${isCollapsed ? 'w-21' : 'w-64'} h-screen bg-gray-800 text-white fixed top-0 left-0 z-10 transition-all duration-300`}>
            {/* Botón para colapsar/expandir la navbar */}
            <button
                className="h-16 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setIsCollapsed(prev => !prev)}
            >
                {isCollapsed ? <span className="text-lg">☰</span> : <span className="text-lg">×</span>}
            </button>

            {/* Encabezado con el logo y nombre de usuario */}
            {!isCollapsed && (
                <div className="flex items-center justify-center h-16 border-b border-gray-700">
                    <img src="/images/Profile.jpg" alt="Logo" className="h-12 w-12 rounded-full" />
                    <span className="ml-2 text-lg">{username}</span>
                </div>
            )}

            {/* Navegación principal */}
            <nav className="flex-1 p-4">
                <ul>
                    <li className="flex items-center py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={handleDashboardClick}>
                        <HomeIcon className="h-6 w-6 mr-2" />
                        {!isCollapsed && "Dashboard"}
                    </li>
                    <li className="flex items-center py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/analytics')}>
                        <ChartPieIcon className="h-6 w-6 mr-2" />
                        {!isCollapsed && "Analytics"}
                    </li>
                    <li className="flex items-center py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/plazas')}>
                        <DocumentIcon className="h-6 w-6 mr-2" />
                        {!isCollapsed && "Plazas"}
                    </li>
                    <li className="flex items-center py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/settings')}>
                        <CogIcon className="h-6 w-6 mr-2" />
                        {!isCollapsed && "Ajustes"}
                    </li>
                </ul>
            </nav>

            {/* Botones de perfil y logout */}
            <div className="p-4 border-t border-gray-700">
                <button className="flex items-center py-2 px-4 text-red-500 hover:bg-gray-700 w-full" onClick={handleLogout}>
                    <XMarkIcon className="h-6 w-6 mr-2" />
                    {!isCollapsed && "Logout"}
                </button>
                <button className="flex items-center py-2 px-4 hover:bg-gray-700 w-full" onClick={() => navigate(`/editprofile/${userId}`)}>
                    <UserIcon className="h-6 w-6 mr-2" />
                    {!isCollapsed && "Editar Perfil"}
                </button>
            </div>
        </div>
    );
};

export default Navbar;

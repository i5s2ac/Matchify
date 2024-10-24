import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    HomeIcon, ChartPieIcon, DocumentIcon, CogIcon, UserIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import axios from 'axios';

const Navbar = ({
                    userId, setIsAuthenticated, setUser,
                    isCollapsed, setIsCollapsed, empresaId, rolId
                }) => {
    const navigate = useNavigate();
    const location = useLocation();  // Para resaltar el ítem activo
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setUserData(response.data.user);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Error al obtener los datos del usuario');
            }
        };

        fetchUser();
    }, [userId]);

    const handleDashboardClick = () => {
        const path = empresaId && rolId
            ? `/home/${userId}/${empresaId}/${rolId}`
            : `/home/${userId}`;
        navigate(path);
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
        <div
            className={`flex flex-col ${isCollapsed ? 'w-24' : 'w-72'} 
            h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white 
            fixed top-0 left-0 z-10 shadow-xl transition-all duration-300`}
        >
            {/* Botón de colapsar/expandir */}
            <button
                className={`h-14 m-4 flex items-center justify-between rounded-lg 
        bg-gray-900 hover:bg-gray-600 transition-all duration-300`}
                aria-label="Toggle Navbar"
                onClick={() => setIsCollapsed(prev => !prev)}
            >
                <div className={`flex items-center gap-4 px-2 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                    <img
                        src="/images/matchify_icon.png"
                        alt="Matchify Icon"
                        className="h-12 w-12 rounded-md"
                    />
                    {!isCollapsed && (
                        <>
                            <span className="text-white text-xl font-semibold">Matchify</span>
                        </>
                    )}
                </div>
            </button>

            {/* Navegación principal */}
            <nav className="flex-1 px-4 ">
                <ul className="space-y-4">
                    <NavItem
                        icon={<HomeIcon className="h-8 w-8"/>}
                        label="Dashboard"
                        isCollapsed={isCollapsed}
                        active={location.pathname.includes('/home')}
                        onClick={handleDashboardClick}
                    />
                    <NavItem
                        icon={<ChartPieIcon className="h-8 w-8"/>}
                        label="Analytics"
                        isCollapsed={isCollapsed}
                        active={location.pathname === '/analytics'}
                        onClick={() => navigate('/analytics')}
                    />
                    <NavItem
                        icon={<DocumentIcon className="h-8 w-8"/>}
                        label="Plazas"
                        isCollapsed={isCollapsed}
                        active={location.pathname === '/plazas'}
                        onClick={() => navigate('/plazas')}
                    />
                    <NavItem
                        icon={<CogIcon className="h-8 w-8"/>}
                        label="Ajustes"
                        isCollapsed={isCollapsed}
                        active={location.pathname === '/settings'}
                        onClick={() => navigate('/settings')}
                    />
                </ul>
            </nav>

            {/* Encabezado del perfil */}
            {!isCollapsed && userData && (
                <div className="flex items-center gap-4 p-4 border-t border-gray-700">
                    <img
                        src="/images/Profile.jpg"
                        alt="Perfil"
                        className="h-12 w-12 rounded-full border-2 border-gray-500 shadow-sm"
                    />
                    <div>
                        <p className="text-lg font-semibold">{userData.username}</p>
                        <p className="text-sm text-gray-400">Mi Perfil</p>
                    </div>
                </div>
            )}

            {/* Sección de errores */}
            {error && <p className="text-red-500 p-4">{error}</p>}

            {/* Botones de perfil y logout */}
            <div className="p-4 border-t border-gray-700">
                <button
                    className={`flex items-center gap-4 py-3 px-4 text-red-500 
            hover:bg-gray-700 transition-all rounded-lg w-full`}
                    onClick={handleLogout}
                >
                    <XMarkIcon className="h-8 w-8"/>
                    {!isCollapsed && <span className="text-white text-lg">Logout</span>}
                </button>
                <button
                    className={`flex items-center gap-4 py-3 px-4 transition-all rounded-lg w-full mt-2 
                    ${location.pathname.includes(`/editprofile/${userId}`)
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700'}`}
                    onClick={() => navigate(`/editprofile/${userId}`)}
                >
                    <UserIcon className="h-8 w-8"/>
                    {!isCollapsed && <span className="text-white text-lg">Editar Perfil</span>}
                </button>
            </div>

        </div>
    );
};

// Componente reutilizable para los ítems del menú
const NavItem = ({icon, label, isCollapsed, active, onClick}) => (
    <li
        className={`flex items-center py-4 px-4 rounded-lg cursor-pointer transition-all
            ${active ? 'bg-gray-700' : 'hover:bg-gray-600'} 
            ${isCollapsed ? 'justify-center' : 'gap-4'}`}
        onClick={onClick}
    >
        {icon}
        {!isCollapsed && <span className="text-lg">{label}</span>}
    </li>
);

export default Navbar;

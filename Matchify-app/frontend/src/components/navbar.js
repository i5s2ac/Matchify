import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // Cambia de Next.js a react-router-dom
import {
    HomeIcon,
    ChartPieIcon,
    DocumentIcon,
    CogIcon,
    MoonIcon,
    BellIcon,
    PlusIcon
} from "@heroicons/react/24/outline";

export default function Navbar({ userId, empresaId, rolId }) {
    const [username, setUsername] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isInCompany, setIsInCompany] = useState(false);
    const [hasCV, setHasCV] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setLoading(true);

                const res = await fetch(`/api/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();

                if (data.success) {
                    setUsername(data.user.username);

                    const resCompany = await fetch(`/api/user/${userId}/empresausuario`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const companyData = await resCompany.json();
                    setIsInCompany(companyData.isInCompany);

                    const response = await fetch(`/api/user/${userId}/getCV`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const cvData = await response.json();

                    if (cvData.success) {
                        const { habilidades, idiomas, experiencias, educaciones, certificaciones } = cvData.data;
                        const hasAnyData = habilidades.length > 0 || idiomas.length > 0 || experiencias.length > 0 || educaciones.length > 0 || certificaciones.length > 0;
                        setHasCV(hasAnyData);
                    } else {
                        console.error('Error fetching CV data:', cvData.message);
                    }
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const dashboardHref = empresaId && rolId
        ? `/home/user/${userId}/${empresaId}/${rolId}`
        : `/home/user/${userId}`;

    const isDashboard = location.pathname === dashboardHref;
    const handleNavigation = () => {
        navigate(`/home/user/${userId}/CV`);
    };

    if (loading) {
        return (
            <header className="flex justify-between border border-gray-200 items-center px-6 py-4 bg-white shadow-sm">
                <div className="flex items-center space-x-2">
                    <img src="/images/Matchify_logo.png" alt="Matchify Logo" width={110} height={110} />
                </div>
                <div className="flex items-center space-x-6">
                    <span>Cargando...</span>
                </div>
            </header>
        );
    }

    return (
        <header className="flex justify-between border border-gray-200 items-center px-6 py-4 bg-white shadow-sm">
            <div className="flex items-center space-x-2">
                <img src="/images/Matchify_logo.png" alt="Matchify Logo" width={110} height={110} />
            </div>

            <nav className="hidden md:flex items-center space-x-8 text-gray-600">
                <Link to={dashboardHref}>
                    <span className={`relative flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${isDashboard ? "text-blue-600 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-21px] after:h-1 after:bg-blue-600" : ""}`}>
                        <HomeIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </span>
                </Link>

                <Link to="/analytics">
                    <span className={`flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${location.pathname === "/analytics" ? "text-blue-600 border-b-4 border-blue-600 pb-2" : ""}`}>
                        <ChartPieIcon className="h-5 w-5" />
                        <span>Analytics</span>
                    </span>
                </Link>

                <Link to="/Plazas">
                    <span className={`flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${location.pathname === "/Plazas" ? "text-blue-600 border-b-4 border-blue-600 pb-2" : ""}`}>
                        <DocumentIcon className="h-5 w-5" />
                        <span>Plazas</span>
                    </span>
                </Link>

                <Link to="/Ajustes">
                    <span className={`flex items-center space-x-2 hover:text-blue-600 transition cursor-pointer ${location.pathname === "/Ajustes" ? "text-blue-600 border-b-4 border-blue-600 pb-2" : ""}`}>
                        <CogIcon className="h-5 w-5" />
                        <span>Ajustes</span>
                    </span>
                </Link>

                {!isInCompany && !empresaId && !rolId && location.pathname.startsWith(`/home/user/${userId}`) && (
                    <button onClick={handleNavigation} className="flex items-center space-x-2 hover:text-blue-600 transition">
                        <PlusIcon className={`h-5 w-5 ${hasCV ? "text-green-600" : "text-gray-600"}`} />
                        <span>{hasCV ? "Modificar CV" : "Crear CV"}</span>
                    </button>
                )}
            </nav>

            <div className="flex items-center space-x-6">
                <button className="hover:text-blue-600 transition">
                    <MoonIcon className="h-6 w-6 text-gray-600" />
                </button>
                <button className="relative hover:text-blue-600 transition">
                    <BellIcon className="h-6 w-6 text-gray-600" />
                    <span className="absolute top-0 right-0 block h-2 w-2 bg-orange-500 rounded-full"></span>
                </button>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 focus:outline-none">
                        <img src="/images/Profile.jpg" alt="User Profile" width={32} height={32} className="rounded-full" />
                        <span className="text-gray-800">{username}</span>
                        <img src="/svg/arrow.svg" alt="Dropdown" width={20} height={20} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <Link to={`/home/user/${userId}/edit`}>
                                <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Edit Profile</span>
                            </Link>
                            <span onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Logout</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}


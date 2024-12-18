import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import RegisterEnterprise from './pages/register_enterprise';
import CompanyHome from './pages/CompanyHome';
import CreateOfferPage from './pages/CreateOffer';
import EditOfferPage from './pages/EditOfferPage';
import Navbar from './components/navbar';
import CV from './pages/cv';
import ProfileEditPage from './pages/ProfileEdit';
import './styles/App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedEmpresaId = localStorage.getItem('empresaId');
        const storedRolId = localStorage.getItem('rolId');

        if (storedToken) {
            setIsAuthenticated(true);
            setUser({
                userId: storedUserId,
                empresaId: storedEmpresaId,
                rolId: storedRolId,
            });
        }
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
    };

    // Hide navbar on specific routes
    const hideNavbarRoutes = ['/', '/login', '/register', '/register_enterprise'];
    const shouldShowNavbar = isAuthenticated && !hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && (
                <Navbar
                    user={user}
                    userId={user?.userId}
                    empresaId={user?.empresaId}
                    rolId={user?.rolId}
                    onLogout={handleLogout}
                    setIsAuthenticated={setIsAuthenticated}
                    setUser={setUser}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
            )}
            <div className={`app-container ${shouldShowNavbar ? (isCollapsed ? 'main-content-collapsed' : 'main-content-expanded') : ''}`}>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/login" element={<Login setIsAuthenticated={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home/:userId" element={<Home />} />
                    <Route path="/register_enterprise" element={<RegisterEnterprise />} />
                    <Route path="/home/:userId/:empresaId/:rolId" element={<CompanyHome />} />
                    <Route path="/home/:userId/:empresaId/:rolId/create_offer" element={<CreateOfferPage />} />
                    <Route path="/home/:userId/:empresaId/:rolId/edit_offer/:offerId" element={<EditOfferPage />} />
                    <Route path="/CV/:userId" element={<CV />} />
                    <Route path="/editprofile/:userId" element={<ProfileEditPage />} />
                </Routes>
            </div>
        </>
    );
}

// Create a RouterWrapper to wrap App in a Router without modifying index.js
function RouterWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default RouterWrapper;

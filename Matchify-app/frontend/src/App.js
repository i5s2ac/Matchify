import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import RegisterEnterprise from './pages/register_enterprise';
import CompanyHome from './pages/CompanyHome';
import CreateOfferPage from './pages/CreateOffer';
import EditOfferPage from './pages/EditOfferPage';
import './styles/index.css';
import Navbar from './components/navbar';
import CV from './pages/cv';
import ProfileEditPage from './pages/ProfileEdit';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            {/* Renderiza la navbar solo si el usuario está autenticado */}
            {isAuthenticated && <Navbar />}
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home/:userId" element={<Home />} />
                <Route path="/register_enterprise" element={<RegisterEnterprise />} />
                <Route path="/home/:userId/:empresaId/:rolId" element={<CompanyHome />} />
                <Route path="/home/:userId/:empresaId/:rolId/create_offer" element={<CreateOfferPage />} />
                <Route path="/home/:userId/:empresaId/:rolId/edit_offer/:offerId" element={<EditOfferPage />} />
                <Route path="/CV/:userId" element={<CV />} />
                <Route path="/editprofile/:userId" element={<ProfileEditPage />} />
            </Routes>
        </Router>
    );
}

export default App;

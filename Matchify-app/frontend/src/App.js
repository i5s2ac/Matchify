import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import RegisterEnterprise from './pages/register_enterprise';
import CompanyHome from './pages/CompanyHome';
import './styles/index.css';
import Navbar from './components/navbar';

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
            </Routes>
        </Router>
    );
}

export default App;

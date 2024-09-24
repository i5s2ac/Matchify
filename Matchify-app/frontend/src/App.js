import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import RegisterEnterprise from './pages/register_enterprise';
import CompanyHome from './pages/CompanyHome';
import './styles/index.css';
import CreateOfferPage from "./pages/CreateOffer";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/home/:userId" element={<Home />} />
            <Route path="/register_enterprise" element={<RegisterEnterprise />} />
            <Route path="/home/:userId/:empresaId/:rolId" element={<CompanyHome />} />
            <Route path="/home/:userId/:empresaId/:rolId/create_offer" element={<CreateOfferPage />} />
        </Routes>
      </Router>
  );
}

export default App;

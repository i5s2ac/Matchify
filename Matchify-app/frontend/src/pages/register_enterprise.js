import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterCompanyPage = () => {
    const [step, setStep] = useState(1);
    const [industrias, setIndustrias] = useState([]); // Inicia con un array vacío
    const [loadingIndustrias, setLoadingIndustrias] = useState(false);
    const [errorIndustrias, setErrorIndustrias] = useState('');
    const [selectedIndustria, setSelectedIndustria] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [sitioWeb, setSitioWeb] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIndustrias = async () => {
            setLoadingIndustrias(true);
            try {
                const response = await axios.get('http://localhost:3001/industry');
                console.log('Response data:', response.data); // Verifica la estructura de la respuesta

                const industriasData = response.data.industrias;

                // Verifica si el dato recibido es un array
                if (Array.isArray(industriasData)) {
                    setIndustrias(industriasData);
                } else {
                    setIndustrias([]);  // Si no es un array, asigna un array vacío
                }

                setLoadingIndustrias(false);
                if (response.data.success && Array.isArray(response.data.industrias)) {
                    setIndustrias(response.data.industrias);  // Acceder al array de industrias
                } else {
                    setIndustrias([]);  // En caso de que no haya industrias
                }
            } catch (error) {
                setErrorIndustrias('Failed to fetch industries');
            } finally {
                setLoadingIndustrias(false);
            }
        };
        fetchIndustrias();
    }, []);





    const handleNextStep = () => {
        if (!companyName || !direccion || !telefono || !email || !sitioWeb || !selectedIndustria) {
            setFormError('Please fill out all required fields.');
        } else {
            setFormError('');
            setStep(step + 1);
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/company/register_company', {
                username,
                email,
                password,
                phone,
                companyName,
                direccion,
                telefono,
                sitioWeb,
                descripcion,
                industriaId: selectedIndustria,  // Asegúrate de enviar este valor
            });
            if (response.data.success) {
                navigate('/login');  // Redirigir a la página que corresponda
            } else {
                setErrorMessage(response.data.message || 'Registration failed, please try again.');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Registration failed, please try again.');
            }
        }
    };


    return (
        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-16">
                <div className="w-full max-w-md">
                    {step === 1 && (
                        <div>
                            <h2 className="text-5xl font-bold mb-10 text-gray-800">Register Your<span className="block mt-4">Company</span></h2>
                            {errorIndustrias && <p className="text-red-500">{errorIndustrias}</p>}
                            {loadingIndustrias ? <p>Loading industries...</p> : (
                                <form className="space-y-6" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                                    <div>
                                        <label htmlFor="industria"
                                               className="block text-lg font-medium text-gray-700">Industry</label>
                                        <select
                                            id="industria"
                                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            value={selectedIndustria}
                                            onChange={(e) => setSelectedIndustria(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Industry</option>
                                            {Array.isArray(industrias) && industrias.map((industria, ind) => (
                                                <option key={industria.id} value={industria.id}>
                                                    {industria.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="companyName" className="block text-lg font-medium text-gray-700">Company Name</label>
                                        <input
                                            type="text"
                                            id="companyName"
                                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            placeholder="Enter your company name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            placeholder="Enter your company's email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="direccion" className="block text-lg font-medium text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            id="direccion"
                                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            placeholder="Enter your address"
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="telefono" className="block text-lg font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            id="telefono"
                                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            placeholder="Enter your phone number"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="sitioWeb" className="block text-lg font-medium text-gray-700">Website</label>
                                        <input
                                            type="url"
                                            id="sitioWeb"
                                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            placeholder="Enter your website URL"
                                            value={sitioWeb}
                                            onChange={(e) => setSitioWeb(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="descripcion" className="block text-lg font-medium text-gray-700">Description</label>
                                        <textarea
                                            id="descripcion"
                                            className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                            placeholder="Enter your company description"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                        />
                                    </div>
                                </form>
                            )}
                            <div className="text-red-600 text-lg mt-4">
                                {formError}
                            </div>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full flex justify-center py-4 px-6 mt-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Next
                            </button>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <h2 className="text-5xl font-bold mb-10 text-gray-800">Register Your User</h2>
                            <form className="space-y-6">
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
                                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone</label>
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
                                <button
                                    type="submit"
                                    onClick={handleRegister}
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Register
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePreviousStep}
                                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Previous
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/Join_Enterprise.png')" }}></div>
        </div>
    );
}

export default RegisterCompanyPage;

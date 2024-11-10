import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';  // Importamos la función de conexión
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import candidatoRoutes from './routes/candidatoRoutes.js';
import cvRoutes from './routes/cvRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Inicializar express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas de autenticación y recursos
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/job', jobRoutes);
app.use('/industry', industryRoutes);
app.use('/company', companyRoutes);
app.use('/candidatos', candidatoRoutes);
app.use('/cv', cvRoutes);

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('Backend Corriendo');
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
});

export default app;
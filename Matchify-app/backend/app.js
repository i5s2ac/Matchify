// backend/app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';  // Importamos la función de conexión para MongoDB
import sequelize from './config/database.js';  // Importar Sequelize para SQL
import defineAssociations from './models/associations.js';
import { getClient } from './config/redisClient.js';  // Importar el cliente de Redis

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

// Middleware para caché (opcional, si deseas usarlo globalmente)
const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
        const key = `__express__${req.originalUrl || req.url}`;
        try {
            const cachedData = await getClient().get(key);
            if (cachedData) {
                res.setHeader('Content-Type', 'application/json');
                return res.send(JSON.parse(cachedData));
            } else {
                res.sendResponse = res.send;
                res.send = async (body) => {
                    await getClient().setEx(key, duration, JSON.stringify(body));
                    res.sendResponse(body);
                };
                next();
            }
        } catch (err) {
            console.error('Error en el middleware de caché:', err);
            next();
        }
    };
};

// Rutas
app.use('/auth', authRoutes);
app.use('/job', jobRoutes);
app.use('/industry', industryRoutes);
app.use('/company', companyRoutes);
app.use('/candidatos', candidatoRoutes);
app.use('/cv', cvRoutes);
app.use('/user', userRoutes);  // La ruta de usuarios ya tiene caché en su controlador

// Endpoint "Hola Mundo"
app.get('/', (req, res) => {
    res.send('Backend Corriendo');
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define las asociaciones y sincroniza con la base de datos
defineAssociations();

const PORT = process.env.PORT || 3001;
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
});

export default app;

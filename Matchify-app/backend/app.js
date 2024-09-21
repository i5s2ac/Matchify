import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import sequelize from './config/database.js'; // Importa la conexión a la base de datos
import defineAssociations from './models/associations.js'; // Importa las asociaciones

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Definir las asociaciones entre los modelos
defineAssociations();

// Rutas de autenticación
app.use('/auth', authRoutes);


// Endpoint "Hola Mundo"
app.get('/', (req, res) => {
    res.send('Backend Corriendo');
});

// Sincronizar los modelos con la base de datos y luego iniciar el servidor
const PORT = process.env.PORT || 3001;
sequelize.sync({ alter: true }) // Esto ajusta las tablas si es necesario
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

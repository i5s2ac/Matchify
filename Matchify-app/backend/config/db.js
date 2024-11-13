// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`, {
            // Removemos las opciones deprecadas
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // En lugar de terminar el proceso, podemos intentar reconectar
        setTimeout(connectDB, 5000);
    }
};

// Añadir manejadores de eventos para la conexión
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(connectDB, 5000);
});

export default connectDB;
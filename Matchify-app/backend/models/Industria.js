import mongoose from 'mongoose';

const industriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true // Garantiza que los nombres de industria sean únicos
    },
    descripcion: {
        type: String,
        required: false // Opcional
    },
    codigo: {
        type: String,
        required: false, // Opcional
        unique: true // Código único si decides usarlo como identificador
    }
}, {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
    collection: 'industrias' // Nombre de la colección en MongoDB
});

// Crear el modelo de Industria usando el esquema definido
const Industria = mongoose.model('Industria', industriaSchema);

export default Industria;

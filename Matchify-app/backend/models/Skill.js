import mongoose from 'mongoose';
import User from './User.js'; // Asegúrate de que la ruta sea correcta

const skillSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    nivelDominio: {
        type: String,
        enum: ['basico', 'intermedio', 'avanzado', 'experto'],
        required: true,
    },
    descripcion: {
        type: String,
        required: false,
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo 'User'
        required: true,
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'skills' // Opcional: especifica el nombre de la colección
});

// Crear el modelo de Skill usando el esquema definido
const Skill = mongoose.model('Skill', skillSchema);

export default Skill;

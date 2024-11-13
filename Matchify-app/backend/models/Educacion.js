// models/Educacion.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
import User from './User.js';  // Asegúrate de que la ruta sea correcta

// Verificar si el modelo ya existe para evitar sobrescribirlo
const Educacion = mongoose.models.Educacion || mongoose.model('Educacion', new Schema({
    institucion: {
        type: String,
        required: true, // Es obligatorio
    },
    gradoObtenido: {
        type: String,
        required: false, // No es obligatorio
    },
    campoEstudio: {
        type: String,
        required: false, // No es obligatorio
    },
    fechaInicio: {
        type: Date,
        required: false, // No es obligatorio
    },
    fechaFin: {
        type: Date,
        required: false, // No es obligatorio
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Relación con el modelo User
        required: true,  // Es obligatorio
    },
}, {
    timestamps: true, // Para manejar fechas de creación y actualización automáticamente
}));

// Exportar el modelo de forma predeterminada
export default Educacion;

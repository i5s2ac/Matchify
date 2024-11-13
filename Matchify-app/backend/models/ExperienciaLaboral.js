// models/ExperienciaLaboral.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
import User from './User.js';  // Changed to ES Module import

// Definición del esquema para ExperienciaLaboral
const experienciaLaboralSchema = new Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Changed to match your User model name
        required: true,
    },
    tituloPuesto: {
        type: String,
        required: true,
    },
    empresa: {
        type: String,
        required: true,
    },
    ubicacion: {
        type: String,
        required: false,
    },
    fechaInicio: {
        type: Date,
        required: false,
    },
    fechaFin: {
        type: Date,
        required: false,
    },
    descripcion: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

// Check if model exists before creating it
const ExperienciaLaboral = mongoose.models.ExperienciaLaboral ||
    mongoose.model('ExperienciaLaboral', experienciaLaboralSchema);

// Changed to ES Module export
export default ExperienciaLaboral;
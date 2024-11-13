// models/Certificacion.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
import User from './User.js';  // Asegúrate de que la ruta sea correcta

// Definición del esquema para Certificacion
const certificacionSchema = new Schema({
    nombre: {
        type: String,
        required: true,  // Es obligatorio
    },
    organizacionEmisora: {
        type: String,
        required: false,  // No es obligatorio
    },
    fechaObtencion: {
        type: Date,
        required: false,  // No es obligatorio
    },
    descripcion: {
        type: String,
        required: false,  // No es obligatorio
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Relación con el modelo User
        required: true,  // Es obligatorio
    },
}, {
    timestamps: true, // Para manejar fechas de creación y actualización automáticamente
});

// Definir el modelo con el nombre 'Certificacion'
const Certificacion = mongoose.model('Certificacion', certificacionSchema);

// Exportar el modelo de forma predeterminada
export default Certificacion;

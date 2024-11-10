// models/CandidatoOferta.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
import User from './User.js';  // Asegúrate de que la ruta sea correcta
import OfertaEmpleo from './OfertaEmpleo.js';  // Asegúrate de que la ruta sea correcta

// Definición del esquema para CandidatoOferta
const candidatoOfertaSchema = new Schema({
    estado: {
        type: String,
        enum: ['pendiente', 'en proceso', 'aceptada', 'rechazada'],
        required: true,
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Relación con el modelo User
        required: true,  // Es obligatorio
    },
    ofertaEmpleoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfertaEmpleo',  // Relación con el modelo OfertaEmpleo
        required: true,  // Es obligatorio
    },
}, {
    timestamps: true, // Para manejar fechas de creación y actualización automáticamente
});

// Definir el modelo con el nombre 'CandidatoOferta'
const CandidatoOferta = mongoose.model('CandidatoOferta', candidatoOfertaSchema);

// Exportar el modelo de forma predeterminada
export default CandidatoOferta;

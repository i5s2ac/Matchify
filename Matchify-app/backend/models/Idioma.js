// models/Idioma.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
import Usuario from './User.js'; // Asegúrate de que la ruta sea correcta

// Definición del esquema para Idioma
const idiomaSchema = new Schema({
    nombre: {
        type: String,
        required: true, // No puede ser nulo
    },
    nivelDominio: {
        type: String,
        enum: ['basico', 'intermedio', 'avanzado', 'experto'], // Valores posibles para el nivel de dominio
        required: true, // No puede ser nulo
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Relación con el modelo Usuario
        required: true, // Es obligatorio
    },
}, {
    timestamps: true, // Para manejar fechas de creación y actualización automáticamente
});

// Definir el modelo con el nombre 'Idioma'
const Idioma = mongoose.model('Idioma', idiomaSchema);

// Exportar el modelo de forma predeterminada
export default Idioma;

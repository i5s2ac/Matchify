// models/EmpresaUsuario.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
import Empresa from './Empresa.js'; // Asegúrate de que la ruta sea correcta
import Usuario from './User.js';    // Asegúrate de que la ruta sea correcta
import Rol from './Rol.js';         // Asegúrate de que la ruta sea correcta

// Definición del esquema para EmpresaUsuario
const empresaUsuarioSchema = new Schema({
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa', // Relación con el modelo Empresa
        required: true, // Es obligatorio
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Relación con el modelo Usuario
        required: true, // Es obligatorio
    },
    rolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol', // Relación con el modelo Rol
        required: true, // Es obligatorio
    },
}, {
    timestamps: true, // Para manejar fechas de creación y actualización automáticamente
});

// Definir el modelo con el nombre 'EmpresaUsuario'
const EmpresaUsuario = mongoose.model('EmpresaUsuario', empresaUsuarioSchema);

export default EmpresaUsuario; // Usa export default para que sea compatible con import ... from

// models/PerfilUsuario.js
import mongoose from 'mongoose';

const perfilUsuarioSchema = new mongoose.Schema({
    resumenProfesional: {
        type: String,
        required: false
    },
    ubicacion: {
        type: String,
        required: false
    },
    fechaUltimaActualizacion: {
        type: Date,
        required: false
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    collection: 'perfil_usuarios'
});

const PerfilUsuario = mongoose.models.PerfilUsuario || mongoose.model('PerfilUsuario', perfilUsuarioSchema);

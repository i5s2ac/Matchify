const notificacionSchema = new mongoose.Schema({
    mensaje: {
        type: String,
        required: true
    },
    fechaEnvio: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['leída', 'no leída'],
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Cambiado a 'User' para mantener consistencia
        required: true
    }
}, {
    timestamps: true,
    collection: 'notificaciones'
});

const Notificacion = mongoose.models.Notificacion || mongoose.model('Notificacion', notificacionSchema);

const historialAplicacionesSchema = new mongoose.Schema({
    fechaAplicacion: {
        type: Date,
        required: true
    },
    estadoAplicacion: {
        type: String,
        enum: ['pendiente', 'en proceso', 'aceptada', 'rechazada'],
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Cambiado a 'User' para mantener consistencia
        required: true
    },
    ofertaEmpleoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfertaEmpleo',
        required: true
    }
}, {
    timestamps: true,
    collection: 'historial_aplicaciones'
});

const HistorialAplicaciones = mongoose.models.HistorialAplicaciones ||
    mongoose.model('HistorialAplicaciones', historialAplicacionesSchema);

export { PerfilUsuario, Notificacion, HistorialAplicaciones };
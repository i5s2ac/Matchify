import mongoose from 'mongoose';

const ofertaEmpleoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 255 // Límite de longitud de la descripción
    },
    ubicacion: {
        type: String,
        required: false
    },
    salario: {
        type: mongoose.Types.Decimal128,
        required: false
    },
    fechaPublicacion: {
        type: Date,
        required: false
    },
    fechaCierre: {
        type: Date,
        required: false
    },
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa', // Cambia 'Empresa' si el modelo de empresa tiene otro nombre
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Cambia 'User' si el modelo de usuario tiene otro nombre
        required: true
    },
    estatus: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    },
    tags: {
        type: [String], // Se almacena como un array de strings en lugar de texto separado por comas
        default: []
    },
    modalidad: {
        type: String,
        enum: ['Presencial', 'Virtual', 'Híbrido'],
        default: 'Presencial'
    },
    tipoTrabajo: {
        type: String,
        enum: ['Tiempo Completo', 'Tiempo Parcial', 'Por Proyecto'],
        default: 'Tiempo Completo'
    },
    Funciones_Requerimiento: {
        type: String,
        required: false
    },
    Estudios_Requerimiento: {
        type: String,
        required: false
    },
    Experiencia_Requerimiento: {
        type: String,
        required: false
    },
    Conocimientos_Requerimiento: {
        type: String,
        required: false
    },
    Competencias_Requerimiento: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    collection: 'ofertas_empleos' // Especifica el nombre de la colección si es necesario
});

// Crear el modelo de OfertaEmpleo usando el esquema definido
const OfertaEmpleo = mongoose.model('OfertaEmpleo', ofertaEmpleoSchema);

export default OfertaEmpleo;

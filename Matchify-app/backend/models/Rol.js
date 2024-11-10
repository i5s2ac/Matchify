import mongoose from 'mongoose';

const rolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true, // Define el nombre del rol como único
    },
    descripcion: {
        type: String,
        required: false, // Opcional
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'roles' // Opcional: especifica el nombre de la colección
});

// Crear el modelo de Rol usando el esquema definido
const Rol = mongoose.model('Rol', rolSchema);

export default Rol;

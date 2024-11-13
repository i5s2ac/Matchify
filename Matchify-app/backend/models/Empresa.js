// models/Empresa.js
import mongoose from 'mongoose';

const EmpresaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: String,
    telefono: String,
    email: String,
    sitioWeb: String,
    descripcion: String,
    industriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industria' },
});

const Empresa = mongoose.model('Empresa', EmpresaSchema);
export default Empresa;  // Asegúrate de exportar el modelo de esta forma

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
    collection: 'users' // Opcional: especifica el nombre de la colección
});

// Crear el modelo de usuario usando el esquema definido
const User = mongoose.model('User', userSchema);

export default User;

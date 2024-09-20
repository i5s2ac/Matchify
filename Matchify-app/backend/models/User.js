import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js
import OfertaEmpleo from './OfertaEmpleo'; // Asegúrate de que la ruta sea correcta

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Considera agregar esta validación para que los usernames sean únicos
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegúrate de que los correos sean únicos
        validate: {
            isEmail: true, // Validación para el formato de email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'users',
});

// Asociaciones directas que no generan ciclos
User.hasMany(OfertaEmpleo, { foreignKey: 'userId', as: 'ofertasEmpleo' });

export default User;

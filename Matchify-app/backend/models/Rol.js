import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Ajusta la ruta según la ubicación de database.js

const Rol = sequelize.define('Rol', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegúrate de que los nombres de rol sean únicos
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true, // Permite que la descripción sea opcional
    },
}, {
    tableName: 'roles',
    timestamps: true, // Si quieres que Sequelize maneje las fechas de creación y actualización
});

export default Rol;
